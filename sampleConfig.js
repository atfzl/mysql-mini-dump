module.exports = {
  verbose: false,
  resultFile: 'dump.sql',
  mysql: {
    host     : 'localhost',
    user     : 'root',
    password : 'paytm@197',
    database : 'mktplace'
  },
  dump: {
    table      : 'catalog_product',
    primaryKey : 'id',
    offset     : 100,
    limit      : 2
  },
  mysqldumpOptions: [],
  overridePrimaryKey: {
    catalog_product: 'id'
  },
  fakeConstraints: [{
    TABLE_NAME: 'catalog_product',
    COLUMN_NAME: 'merchant_id',
    REFERENCED_TABLE_NAME: 'merchant',
    REFERENCED_COLUMN_NAME: 'id'
  }]
};
