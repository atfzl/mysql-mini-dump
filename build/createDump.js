'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDump;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _childProcessPromise = require('child-process-promise');

var _childProcessPromise2 = _interopRequireDefault(_childProcessPromise);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exec = _childProcessPromise2.default.exec;
var appendFile = _bluebird2.default.promisify(_fs2.default.appendFile);

function createDump(primaryIdsMap) {
  var mysqldumpArguments = _config2.default.mysqldumpOptions.concat(['skip-add-drop-table']).map(function (val) {
    return '--' + val;
  }).concat(['-h' + _config2.default.mysqlConfig.host, '-u' + _config2.default.mysqlConfig.user, '-p' + _config2.default.mysqlConfig.password, '' + _config2.default.mysqlConfig.database]);

  var chunkSize = _config2.default.chunkSize,
      finalArr = [];

  _fs2.default.unlinkSync(_config2.default.resultFile);

  primaryIdsMap = _lodash2.default.mapValues(primaryIdsMap, function (value) {
    return _lodash2.default.chunk(Array.from(value), chunkSize);
  });

  _lodash2.default.forOwn(primaryIdsMap, function (idChunks, table) {
    finalArr.push(table); // for drop table statement
    _lodash2.default.forEach(idChunks, function (idChunk) {
      finalArr.push([table, idChunk]);
    });
  });

  return _bluebird2.default.each(finalArr, function (arr) {
    if (typeof arr === 'string') {
      var table = arr;
      return appendFile(_config2.default.resultFile, 'DROP TABLE IF EXISTS `' + table + '` \n');
    } else {
      return mysqldump(mysqldumpArguments.concat(whereCondition(arr[0], arr[1])));
    }
  }).then(function () {
    return _bluebird2.default.resolve(_config2.default.resultFile);
  });
};

function whereCondition(table, ids) {
  var primaryKey = _lodash2.default.get(_config2.default, 'overridePrimaryKey[' + table + ']') || 'id';
  return [table, '--where', '"' + primaryKey + ' in (' + ids.join(',') + ')"'];
}

function mysqldump(mysqldumpArguments) {
  if (_config2.default.verbose) console.log("mysqldumpArguments = ", mysqldumpArguments);

  return exec('mysqldump ' + mysqldumpArguments.join(' ')).then(function (result) {
    return appendFile(_config2.default.resultFile, result.stdout);
  }).fail(function (err) {
    return _bluebird2.default.reject('mysqldump error. Please try running with verbose option, Err: ' + err);
  });
}