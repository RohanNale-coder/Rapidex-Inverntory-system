require('dotenv').config();
const { Sequelize } = require('sequelize');

async function main() {
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

  try {
    await seq.authenticate();
    console.log('Connection OK as', process.env.DB_USER);
    
    await seq.query('CREATE TABLE IF NOT EXISTS __write_test (id INT)');
    await seq.query('DROP TABLE __write_test');
    console.log('Write access confirmed!');
  } catch(e) {
    console.log('ERROR:', e.message);
  }
  await seq.close();
}

main();
