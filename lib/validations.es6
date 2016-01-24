// if (process.argv.length !== 3) {
//   console.log('Please provide path to json config file as next argument'.red);
// }
import _      from 'lodash';
import config from './config';

var shouldHaveKeys = ['mysql.password',
                      'mysql.database',
                      'dump.table',
                      'dump.offset',
                      'dump.limit'];

shouldHaveKeys.forEach(function (key) {
  if (!_.has(config, key)) {
    console.log(`need ${key.blue} key in config file !`);
    process.exit(1);
  }
});

if (config.fakeConstraints) {
  let requiredKeys = ['TABLE_NAME', 'COLUMN_NAME', 'REFERENCED_TABLE_NAME', 'REFERENCED_COLUMN_NAME'];
  
  if (!_.isArray(config.fakeConstraints)) {
    console.log('fakeConstraints must be an array');
    process.exit(1);
  }

  _.every(config.fakeConstraints, (ob) => {
    return _.every(_.keys(ob), (key) => {
      if (!_.includes(requiredKeys, key)) {
        console.log(`${key} in not a valid key in fakeConstraints`);
        process.exit(1);
      }
    });
  });
}
