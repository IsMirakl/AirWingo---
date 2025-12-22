require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

console.log('🔧 DB_USER:', process.env.DB_USER);
console.log('🔧 DB_HOST:', process.env.DB_HOST);
console.log('🔧 DB_DATABASE:', process.env.DB_DATABASE);
console.log('🔧 DB_PORT:', process.env.DB_PORT);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', (client) => {
  console.log('✅ Подключено к БД:', client.database);
});

const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = {
  query,
  pool,
};
