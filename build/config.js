'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filePath = './../sampleConfig.js';

try {
  var config = require(filePath);
} catch (e) {
  console.log('Please provide path to valid js or json file');
  process.exit(1);
}

exports.default = _lodash2.default.merge({
  resultFile: 'mysql-constraint-dump.sql',
  mysql: {
    host: 'localhost',
    user: 'root'
  }
}, config);