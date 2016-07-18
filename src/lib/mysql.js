import $config from './config';
import mysql from 'mysql';

const connection = mysql.createConnection({
  database: $config().db.mysql.database,
  host: $config().db.mysql.host,
  password: $config().db.mysql.password,
  port: $config().db.mysql.port,
  user: $config().db.mysql.user
});

export default {
  find,
  findAll,
  findBy,
  findBySQL,
  findFirst,
  findLast,
  query
};

function find(obj, callback) {
  if (!obj.id || !obj.table) {
    return false;
  }

  let fields = obj.fields || '*';
  let sql = `SELECT ${fields} FROM ${obj.table} WHERE ${obj.key} = ${obj.id}`;

  return connection.query(sql, callback);
}

function findAll(obj, callback) {
  if (!obj.table) {
    return false;
  }

  let fields = obj.fields || '*';
  let group = obj.group ? ` GROUP BY ${obj.group} ` : '';
  let order = obj.order ? ` ORDER BY ${obj.order} ` : '';
  let limit = obj.limit ? ` LIMIT ${obj.limit} ` : '';
  let sql = `SELECT ${fields} FROM ${obj.table}${group}${order}${limit}`;

  return connection.query(sql, callback);
}

function findBy(obj, callback) {
  if (!obj.table) {
    return false;
  }

  let fields = obj.fields || '*';
  let group = obj.group ? ` GROUP BY ${obj.group} ` : '';
  let order = obj.order ? ` ORDER BY ${obj.order} ` : '';
  let limit = obj.limit ? ` LIMIT ${obj.limit} ` : '';
  let where = ` WHERE ${obj.field} = '${obj.value}' `;
  let sql = `SELECT ${fields} FROM ${obj.table}${where}${group}${order}${limit}`;

  return connection.query(sql, callback);
}

function findBySQL(obj, callback) {
  if (!obj.table || !obj.query) {
    return false;
  }

  let fields = obj.fields || '*';
  let group = obj.group ? ` GROUP BY ${obj.group} ` : '';
  let order = obj.order ? ` ORDER BY ${obj.order} ` : '';
  let limit = obj.limit ? ` LIMIT ${obj.limit} ` : '';
  let sql = `SELECT ${fields} FROM ${obj.table} WHERE ${obj.query}${group}${order}${limit}`;

  return connection.query(sql, callback);
}

function findFirst(obj, callback) {
  if (!obj.table) {
    return false;
  }

  let fields = obj.fields || '*';
  let sql = `SELECT ${fields} FROM ${obj.table} LIMIT 1`;

  return connection.query(sql, callback);
}

function findLast(obj, callback) {
  if (!obj.table || !obj.key) {
    return false;
  }

  let fields = obj.fields || '*';
  let sql = `SELECT ${fields} FROM ${obj.table} ORDER BY ${obj.key} DESC LIMIT 1`;

  return connection.query(sql, callback);
}

function query(sql, callback) {
  return sql
    ? connection.query(sql, callback)
    : false;
}
