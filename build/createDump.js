'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDump;

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_shelljs2.default.config.silent = true;

var exec = _bluebird2.default.promisify(_shelljs2.default.exec, { context: _shelljs2.default, multiArgs: true });

var mysqldumpBase = 'mysqldump -h' + _config2.default.mysql.host + ' -u' + _config2.default.mysql.user + ' -p' + _config2.default.mysql.password + ' ' + _config2.default.mysql.database;

function createDump(primaryIdsMap) {
  var tableDumps = _lodash2.default.map(primaryIdsMap, function (ids, table) {
    var primaryKey = _config2.default.overridePrimaryKey[table] || 'id';
    return table + ' --where "' + primaryKey + ' in (' + Array.from(ids) + ')"';
  }).join(' ');

  var mysqldumpOptions = _config2.default.mysqldumpOptions.map(function (val) {
    return '--' + val;
  }).join(' ');

  var resultFile = '--result-file ' + _config2.default.resultFile;

  var finalDumpQuery = mysqldumpBase + ' ' + tableDumps + ' ' + mysqldumpOptions + '  ' + resultFile;

  return exec(finalDumpQuery).then(function (stdout, stderr) {
    return stderr ? _bluebird2.default.reject(stderr) : _bluebird2.default.resolve(_config2.default.resultFile);
  });
};