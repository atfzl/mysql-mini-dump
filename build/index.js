'use strict';

require('colors');

require('./validations');

var _primaryKeysMap = require('./primaryKeysMap');

var _primaryKeysMap2 = _interopRequireDefault(_primaryKeysMap);

var _createDump = require('./createDump');

var _createDump2 = _interopRequireDefault(_createDump);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _primaryKeysMap2.default)().then(_createDump2.default).then(function (fileName) {
  console.log((fileName + ' created !').blue);
  process.exit(0);
}).catch(function (err) {
  console.log(err);
  process.exit(1);
});