import _ from 'lodash';
import db from './mysql';
import utils from './utils';

export default __construct;

function __construct(schema) {
  return {
    executeQuery: executeQuery,
    get: get,
    getProcedure: getProcedure,
    query: query
  };
}

function executeQuery(sql, callback) {
  db.query(sql, callback);
}

function get(q, callback) {
  let fields = Object.keys(q);
  let count = fields.length - 1;
  let query = '';
  let field;
  let value;
  let i;

  if (q === 'all') {
    schema.fields = schema.fields;

    db.findAll({
      table: schema.table,
      fields: schema.fields,
      group: schema.group,
      order: schema.order,
      limit: schema.limit
    }, callback);
  } else if (!isNaN(q)) {
    schema.key = schema.key;
    schema.fields = schema.fields;

    db.find({
      id: parseInt(q),
      table: schema.table,
      fields: schema.fields,
      key: schema.key
    }, callback);
  } else if (typeof(q) === 'object') {
    if (fields.length > 1) {
      for (i = 0; i <= count; i++) {
        if (i === count) {
          query += `${fields[i]} = '${q[fields[i]]}'`;
        } else {
          query += `${fields[i]} = '${q[fields[i]]}' AND `;
        }
      }

      db.findBySQL({
        query: query,
        table: schema.table,
        fields: schema.fields,
        group: schema.group,
        order: schema.order,
        limit: schema.limit
      }, callback);
    } else {
      field = fields[0];
      value = q[field];

      db.findBy({
        field: field,
        value: value,
        table: schema.table,
        fields: schema.fields,
        group: schema.group,
        order: schema.order,
        limit: schema.limit
      }, callback);
    }
  }

  return false;
}

function getProcedure(procedure, values, fields, filter) {
  let params = '';
  let i = 0;
  let total = fields.length - 1;
  let value;
  let keys = _.keys(values);
  let encrypted = false;
  let method;
  let filters = filter || {};

  if (utils.isUndefined(filters)) {
    filters = {};
  }

  if (keys[0].length === 32) {
    encrypted = true;
  }

  _.forEach(fields, (field) => {
    value = values[(encrypted) ? utils.md5(field) : field];

    if (utils.isUndefined(value)) {
      value = '';
    }

    if (field === 'networkId') {
      value = '\'' + utils.clean(value.toString()) + '\'';
    }

    if (!utils.isNumber(value)) {
      method = filters[field];

      if (filter === false) {
        value = `'${value}'`;
      } else {
        if (utils.Type.isDefined(method) && utils.Type.isFunction(utils[method])) {
          value = `'${utils[method](value)}'`;
        } else {
          value = `'${utils.String.clean(value)}'`;
        }
      }
    }

    if (i === total) {
      params += value;
    } else {
      params += `${value}, `;
      i++;
    }
  });

  procedure = `CALL ${procedure} (${params});`;

  return procedure.replace(new RegExp(', ,', 'g'), ', \'\',');
}

function query(sql, callback, fn) {
  executeQuery(sql, (error, result) => {
    fn(result, callback);
  });
}
