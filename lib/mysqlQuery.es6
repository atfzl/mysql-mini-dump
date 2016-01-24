import P      from 'bluebird';
import mysql  from 'mysql';
import config from './config';

let mysqlClient = mysql.createConnection(config.mysql),
    query       = P.promisify(::mysqlClient.query);

process.on('exit', () => mysqlClient.end());

mysqlClient.connect();

export default query;
