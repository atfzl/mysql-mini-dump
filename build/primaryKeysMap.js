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

var _set = require('set');

var _set2 = _interopRequireDefault(_set);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dump = _config2.default.dump;
function getPrimaryKeyMap() {
  return _bluebird2.default.all([(0, _utils.getMainTableRows)(dump), (0, _utils.getForeignKeyMap)(dump)]).spread(function (rows, foreignKeyMap) {
    mapInterface.fill(dump.table, _lodash2.default.map(rows, dump.primaryKey));
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
        var _context;

        ids.forEach((_context = map[table]).add.bind(_context));
      } else {
        map[table] = new _set2.default(ids);
      }
    },
    get: function get() {
      return map;
    }
  };
}();