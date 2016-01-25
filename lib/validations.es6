// if (process.argv.length < 2) {
//   console.log('Please provide path to json config file as next argument'.red);
//   process.exit(1);
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

  _.forEach(config.fakeConstraints, (ob) => {
    let valid = _.every(requiredKeys, _.partial(_.has, ob));
    let difference = _.difference(requiredKeys, _.keys(ob));
    if (!valid) {
      console.log(`${require('util').inspect(ob, false, null)} \n in fakeConstraints is missing required key(s): ${difference}`);
      process.exit(1);
    }
  });
}
