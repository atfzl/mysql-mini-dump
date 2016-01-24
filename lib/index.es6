import 'colors';
import './validations';

import getPrimaryKeysMap from './primaryKeysMap';
import createDump        from './createDump';

getPrimaryKeysMap()
  .then(createDump)
  .then((fileName) => {
    console.log(`${fileName} created !`.blue);
    process.exit(0);
  })
  .catch((err) => {
    console.log('Error'.red);
    console.log(require('util').inspect(err, false, null));
    process.exit(1);
  });
