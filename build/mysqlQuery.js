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

var mysqlClient = _mysql2.default.createConnection(_config2.default.mysql),
    query = _bluebird2.default.promisify(mysqlClient.query.bind(mysqlClient));

process.on('exit', function () {
    return mysqlClient.end();
});

mysqlClient.connect();

exports.default = query;