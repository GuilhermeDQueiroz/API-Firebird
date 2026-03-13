const Firebird = require('node-firebird');

const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  pageSize: 8192
};

// pool com 5 conexões
const pool = Firebird.pool(5, options);

module.exports = pool;