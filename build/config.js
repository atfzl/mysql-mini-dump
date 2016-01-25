'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filePath = _lodash2.default.last(process.argv);

try {
  var file = _fs2.default.readFileSync(filePath);
  var config = JSON.parse(file);
} catch (e) {
  console.log('Please provide path to a valid json file');
  console.log('Error: ' + e);
  process.exit(1);
}

exports.default = _lodash2.default.merge({
  resultFile: 'mysql-constraint-dump.sql',
  mysql: {
    host: 'localhost',
    user: 'root'
  }
}, config);