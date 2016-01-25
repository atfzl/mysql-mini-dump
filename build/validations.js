'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// if (process.argv.length !== 3) {
//   console.log('Please provide path to json config file as next argument'.red);
// }

var shouldHaveKeys = ['mysql.password', 'mysql.database', 'dump.table', 'dump.offset', 'dump.limit'];

shouldHaveKeys.forEach(function (key) {
  if (!_lodash2.default.has(_config2.default, key)) {
    console.log('need ' + key.blue + ' key in config file !');
    process.exit(1);
  }
});

if (_config2.default.fakeConstraints) {
  (function () {
    var requiredKeys = ['TABLE_NAME', 'COLUMN_NAME', 'REFERENCED_TABLE_NAME', 'REFERENCED_COLUMN_NAME'];

    if (!_lodash2.default.isArray(_config2.default.fakeConstraints)) {
      console.log('fakeConstraints must be an array');
      process.exit(1);
    }

    _lodash2.default.forEach(_config2.default.fakeConstraints, function (ob) {
      var valid = _lodash2.default.every(requiredKeys, _lodash2.default.partial(_lodash2.default.has, ob));
      var difference = _lodash2.default.difference(requiredKeys, _lodash2.default.keys(ob));
      if (!valid) {
        console.log(require('util').inspect(ob, false, null) + ' \n in fakeConstraints is missing required key(s): ' + difference);
        process.exit(1);
      }
    });
  })();
}