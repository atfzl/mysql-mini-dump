let filePath = './../sampleConfig.js';

try {
  var config = require(filePath);
} catch(e) {
  console.log('Please provide path to valid js or json file');
  process.exit(1);
}

export default config;
