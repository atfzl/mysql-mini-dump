import _      from 'lodash';
import P      from 'bluebird';
import query  from './mysqlQuery';
import config from './config';

export const getMainTableRows = ({ table, offset, limit }) => {
  let q = `select * from ${table} limit ${offset}, ${limit} ;`;
  logQuery(q);
  return query(q)
    .catch(err => P.reject([q, err]) );
};

export const getTableRows = ({ table, ids}) => {
  let primaryKey = _.get(config, 'overridePrimaryKey[table]') || 'id';
  let q = `select * from ${table} where ${primaryKey} in ( ${ids} ) ;`;
  logQuery(q);
  return query(q)
    .catch(err => P.reject([q, err]) );
};

export const getForeignKeyMap = ({ table }) => {
  let q = `select * from information_schema.key_column_usage where table_name = "${table}" ;`;
  logQuery(q);
  return query(q)
    .then(res => {
      res = _(res)
        .filter(row => row.REFERENCED_TABLE_NAME != null )
        .map(row => _.pick(row, ['TABLE_NAME', 'COLUMN_NAME', 'REFERENCED_TABLE_NAME', 'REFERENCED_COLUMN_NAME']) )
        .concat(_.filter(config.fakeConstraints, {TABLE_NAME: table}))
        .keyBy('COLUMN_NAME')
        .value();

      return P.resolve(res);
    })
    .catch(err => P.reject([q, err]));
};

const logQuery = (q) => {
  if (config.verbose)
    console.log(q.green);
};
