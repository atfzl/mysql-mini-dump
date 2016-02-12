import _              from 'lodash';
import P              from 'bluebird';
import fs             from 'fs';
import child_process  from 'child-process-promise';
import config         from './config';

const exec       = child_process.exec;
const appendFile = P.promisify(fs.appendFile);

export default function createDump (primaryIdsMap) {
  let mysqldumpArguments = config.mysqldumpOptions
        .concat(['skip-add-drop-table'])
        .map(val => `--${val}`)
        .concat([
          `-h${config.mysqlConfig.host}`,
          `-u${config.mysqlConfig.user}`,
          `-p${config.mysqlConfig.password}`,
          `${config.mysqlConfig.database}`]);

  let chunkSize = config.chunkSize,
      finalArr  = [];

  fs.unlinkSync(config.resultFile);
  
  primaryIdsMap = _.mapValues(primaryIdsMap, value => _.chunk(Array.from(value), chunkSize));
  
  _.forOwn(primaryIdsMap, (idChunks, table) => {
    finalArr.push(table); // for drop table statement
    _.forEach(idChunks, idChunk => {
      finalArr.push([table, idChunk]);
    });
  });
  
  return P.each(finalArr, (arr) => {
    if (typeof arr === 'string') {
      let table = arr;
      return appendFile(config.resultFile, `DROP TABLE IF EXISTS \`${table}\` \n`);
    } else {
      return mysqldump(mysqldumpArguments.concat(whereCondition(arr[0], arr[1])));
    }
  }).then(() => P.resolve(config.resultFile));
};

function whereCondition (table, ids) {
  let primaryKey = _.get(config, `overridePrimaryKey[${table}]`) || 'id';
  return [table, '--where', `"${primaryKey} in (${ids.join(',')})"`];
}

function mysqldump (mysqldumpArguments) {
  if (config.verbose)
    console.log("mysqldumpArguments = ", mysqldumpArguments);
  
  return exec('mysqldump ' + mysqldumpArguments.join(' '))
    .then(result => {
      return appendFile(config.resultFile, result.stdout);
    }).fail(err => P.reject('mysqldump error. Please try running with verbose option, Err: ' + err));
}
