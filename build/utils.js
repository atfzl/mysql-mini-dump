'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getForeignKeyMap = exports.getTableRows = exports.getMainTableRows = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mysqlQuery = require('./mysqlQuery');

var _mysqlQuery2 = _interopRequireDefault(_mysqlQuery);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getMainTableRows = exports.getMainTableRows = function getMainTableRows(_ref) {
  var starterQuery = _ref.starterQuery;

  var q = starterQuery;
  logQuery(q);
  return (0, _mysqlQuery2.default)(q).catch(function (err) {
    return _bluebird2.default.reject([q, err]);
  });
};

var getTableRows = exports.getTableRows = function getTableRows(_ref2) {
  var table = _ref2.table;
  var ids = _ref2.ids;

  var primaryKey = _lodash2.default.get(_config2.default, 'overridePrimaryKey[' + table + ']') || 'id';
  var q = 'select * from ' + table + ' where ' + primaryKey + ' in ( ' + ids + ' ) ;';
  logQuery(q);
  return (0, _mysqlQuery2.default)(q).catch(function (err) {
    return _bluebird2.default.reject([q, err]);
  });
};

var getForeignKeyMap = exports.getForeignKeyMap = function getForeignKeyMap(_ref3) {
  var table = _ref3.table;

  var q = 'select * from information_schema.key_column_usage where table_name = "' + table + '" ;';
  logQuery(q);
  return (0, _mysqlQuery2.default)(q).then(function (res) {
    res = (0, _lodash2.default)(res).filter(function (row) {
      return row.REFERENCED_TABLE_NAME != null;
    }).map(function (row) {
      return _lodash2.default.pick(row, ['TABLE_NAME', 'COLUMN_NAME', 'REFERENCED_TABLE_NAME', 'REFERENCED_COLUMN_NAME']);
    }).concat(_lodash2.default.filter(_config2.default.fakeConstraints, { TABLE_NAME: table })).keyBy('COLUMN_NAME').value();

    return _bluebird2.default.resolve(res);
  }).catch(function (err) {
    return _bluebird2.default.reject([q, err]);
  });
};

var logQuery = function logQuery(q) {
  if (_config2.default.verbose) console.log(q.green);
};