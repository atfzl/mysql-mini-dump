import shell  from 'shelljs';
import _      from 'lodash';
import fs     from 'fs';
import P      from 'bluebird';
import config from './config';

shell.config.silent = true;

let exec = P.promisify(shell.exec, {context: shell, multiArgs: true});

let mysqldumpBase = `mysqldump -h${config.mysql.host} -u${config.mysql.user} -p${config.mysql.password} ${config.mysql.database}`;

export default function createDump (primaryIdsMap) {
  let tableDumps = _.map(primaryIdsMap, (ids, table) => {
    let primaryKey = config.overridePrimaryKey[table] || 'id';
    return `${table} --where "${primaryKey} in (${Array.from(ids)})"`;
  }).join(' ');

  let mysqldumpOptions = config.mysqldumpOptions
        .map(val => `--${val}`).join(' ');
  
  let resultFile = `--result-file ${config.resultFile}`;
  
  let finalDumpQuery = `${mysqldumpBase} ${tableDumps} ${mysqldumpOptions}  ${resultFile}`;
  
  return exec(finalDumpQuery)
    .then((stdout, stderr) => {
      return stderr
        ? P.reject(stderr)
        : P.resolve(config.resultFile);
    });
};
