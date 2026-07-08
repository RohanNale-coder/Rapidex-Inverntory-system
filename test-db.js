require('dotenv').config();
const { Sequelize } = require('sequelize');
const seq = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true',
  dialectOptions: process.env.DB_SSL === 'true' ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  logging: false
});

seq.query('SELECT id, email, firstName, lastName FROM "Users"')
  .then(r => console.log(JSON.stringify(r[0], null, 2)))
  .catch(e => console.log('Query error:', e.message))
  .then(() => seq.close());
