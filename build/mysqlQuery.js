'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conn = _mysql2.default.createConnection(_config2.default.mysqlConfig),
    query = _bluebird2.default.promisify(conn.query, { context: conn });

process.on('exit', function () {
    return conn.end();
});

conn.connect();

exports.default = query;