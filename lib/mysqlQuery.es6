import P      from 'bluebird';
import mysql  from 'mysql';
import config from './config';

let conn  = mysql.createConnection(config.mysqlConfig),
    query = P.promisify(conn.query, {context: conn});

process.on('exit', () => conn.end());

conn.connect();

export default query;
