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

  try {
    fs.unlinkSync(config.resultFile);
  } catch (e) {} // silent even if file doesn't exist

  fs.writeFileSync(config.resultFile, 'SET FOREIGN_KEY_CHECKS=0;\n');
  
  primaryIdsMap = _.mapValues(primaryIdsMap, value => _.chunk(Array.from(value), chunkSize));
  
  _.forOwn(primaryIdsMap, (idChunks, table) => {
    _.forEach(idChunks, (idChunk, index) => {
      if (index === 0) {
        finalArr.push([table, idChunk, true]);
      } else {
        finalArr.push([table, idChunk]);
      }
    });
  });
  
  return P.each(finalArr, (arr) => {
    if (arr[2]) { // first chunk of ids of a table
      let table = arr[0];
      return appendFile(config.resultFile, `DROP TABLE IF EXISTS \`${table}\`;\n`)
        .then(() => {
          let table = arr[0],
              ids   = arr[1];
          return mysqldump(mysqldumpArguments.concat(whereCondition(arr[0], arr[1]))); // includes create table statement
        });
    } else {
      let table = arr[0],
          ids   = arr[1];
      return mysqldump(mysqldumpArguments.concat(['--no-create-info']).concat(whereCondition(arr[0], arr[1])));
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
  
  return exec('mysqldump ' + mysqldumpArguments.join(' '), {maxBuffer: 10 * 1024 * 1024})
    .then(result => {
      return appendFile(config.resultFile, result.stdout);
    }).fail(err => P.reject('mysqldump error. Please try running with verbose option, Err: ' + err));
}
