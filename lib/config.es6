import _    from 'lodash';
import fs   from 'fs';
import path from 'path';

let filePath = path.resolve(process.argv[2]);

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

let finalConfig = _.merge({
  resultFile: 'mysql-constraint-dump.sql',
  mysql: {
    host: 'localhost',
    user: 'root'
  },
  mysqldumpOptions: []
}, config);

if (_.includes(process.argv, '-v')) {
  finalConfig.verbose = true;
}

export default finalConfig;
