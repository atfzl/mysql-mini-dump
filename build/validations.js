'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_config2.default.resultFile = _config2.default.resultFile || 'mysql-constraint-dump.sql'; // if (process.argv.length !== 3) {
//   console.log('Please provide path to json config file as next argument'.red);
// }