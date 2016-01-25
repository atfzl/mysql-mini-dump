import _  from 'lodash';
import fs from 'fs';

let filePath = process.argv[2];

if (!filePath) {
  logErrorAndExit();
}

try {
  let file = fs.readFileSync(filePath);
  var config = JSON.parse(file);
} catch(e) {
  logErrorAndExit(e);
}

function logErrorAndExit (e) {
  console.log('Please provide path to a valid json file');
  if (e)
    console.log(`Error: ${e}`);
  process.exit(1);
}

export default _.merge({
  resultFile: 'mysql-constraint-dump.sql',
  mysql: {
    host: 'localhost',
    user: 'root'
  },
  verbose: _.includes(process.argv, '-v'),
  mysqldumpOptions: []
}, config);
