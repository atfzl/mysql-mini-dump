module.exports = {
  verbose: false,
  resultFile: 'dump.sql',
  mysql: {
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'database'
  },
  dump: {
    table      : 'product',
    primaryKey : 'id',
    offset     : 100,
    limit      : 100
  },
  mysqldumpOptions: ['quote-names', 'lock-all-tables'],
  overridePrimaryKey: {
    category: 'id'
  },
  fakeConstraints: [{
    TABLE_NAME: 'product',
    COLUMN_NAME: 'merchant_id',
    REFERENCED_TABLE_NAME: 'merchant',
    REFERENCED_COLUMN_NAME: 'id'
  }]
};
