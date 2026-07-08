require('dotenv').config();
const { sequelize } = require('./src/models');

async function checkAdmin() {
  try {
    const [results] = await sequelize.query('SELECT * FROM "Users" WHERE email = \'admin@erp.com\'');
    console.log('Admin user exists:', results.length > 0);
    if (results.length > 0) {
      console.log('User details:', results[0]);
    }
  } catch (err) {
    console.log('Error:', err.message);
  } finally {
    await sequelize.close();
  }
}

checkAdmin();