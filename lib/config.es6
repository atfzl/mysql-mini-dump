import _  from 'lodash';
import fs from 'fs';

let filePath = _.last(process.argv);

try {
  let file = fs.readFileSync(filePath);
  var config = JSON.parse(file);
} catch(e) {
  console.log('Please provide path to a valid json file');
  console.log(`Error: ${e}`);
  process.exit(1);
}

export default _.merge({
  resultFile: 'mysql-constraint-dump.sql',
  mysql: {
    host: 'localhost',
    user: 'root'
  }
}, config);
