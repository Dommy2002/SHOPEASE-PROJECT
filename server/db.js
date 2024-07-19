const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sales_data',
  password: 'Postgresql@22', // use your actual password
  port: 5434, // your actual port number
});

module.exports = pool;
