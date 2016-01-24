import _ from 'lodash';

let filePath = './../sampleConfig.js';

try {
  var config = require(filePath);
} catch(e) {
  console.log('Please provide path to valid js or json file');
  process.exit(1);
}

export default _.merge({
  resultFile: 'mysql-constraint-dump.sql',
  mysql: {
    host: 'localhost',
    user: 'root'
  }
}, config);
