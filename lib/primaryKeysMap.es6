import P      from 'bluebird';
import _      from 'lodash';
import config from './config';
import Set    from 'set';

import {
  getMainTableRows,
  getTableRows,
  getForeignKeyMap
} from './utils';

let { dump } = config;

export default function getPrimaryKeyMap () {
  return P.all([getMainTableRows(dump), getForeignKeyMap(dump)])
    .spread((rows, foreignKeyMap) => {
      mapInterface.fill(dump.table, _.map(rows, dump.primaryKey));
      return core(rows, foreignKeyMap);
    })
    .then(() => P.resolve(mapInterface.get()) );
}

function recursiveResolve ({table, ids}) {
  return P.all([getTableRows({table, ids}), getForeignKeyMap({table})])
    .spread(core);
}

function core (rows, foreignKeyMap) {
  return P.all(_.map(foreignKeyMap, (val, column) => {
    let foreignIds = _(rows).map(column).uniq().compact().value();
    mapInterface.fill(val.REFERENCED_TABLE_NAME, foreignIds);
    
    return foreignIds.length
      ? recursiveResolve({table: val.REFERENCED_TABLE_NAME, ids: foreignIds})
      : P.resolve();
  }));
}

var mapInterface = (function() {
  let map = {};
  return {
    fill(table, ids) {
      if (map[table]) {
        ids.forEach(::map[table].add);
      } else {
        map[table] = new Set(ids);
      }
    },
    get () {
      return map;
    }
  };
})();
