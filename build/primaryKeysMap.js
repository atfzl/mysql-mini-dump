'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPrimaryKeyMap;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dumpConfig = _config2.default.dumpConfig;
function getPrimaryKeyMap() {
  return _bluebird2.default.all([(0, _utils.getMainTableRows)(dumpConfig), (0, _utils.getForeignKeyMap)(dumpConfig)]).spread(function (rows, foreignKeyMap) {
    mapInterface.fill(dumpConfig.table, _lodash2.default.map(rows, dumpConfig.primaryKey));
    return core(rows, foreignKeyMap);
  }).then(function () {
    return _bluebird2.default.resolve(mapInterface.get());
  });
}

function recursiveResolve(_ref) {
  var table = _ref.table;
  var ids = _ref.ids;

  return _bluebird2.default.all([(0, _utils.getTableRows)({ table: table, ids: ids }), (0, _utils.getForeignKeyMap)({ table: table })]).spread(core);
}

function core(rows, foreignKeyMap) {
  return _bluebird2.default.all(_lodash2.default.map(foreignKeyMap, function (val, column) {
    var foreignIds = (0, _lodash2.default)(rows).map(column).uniq().compact().value();
    mapInterface.fill(val.REFERENCED_TABLE_NAME, foreignIds);

    return foreignIds.length ? recursiveResolve({ table: val.REFERENCED_TABLE_NAME, ids: foreignIds }) : _bluebird2.default.resolve();
  }));
}

var mapInterface = function () {
  var map = {};
  return {
    fill: function fill(table, ids) {
      if (map[table]) {
        ids.forEach(map[table].add.bind(map[table]));
      } else {
        map[table] = new Set(ids);
      }
    },
    get: function get() {
      return map;
    }
  };
}();