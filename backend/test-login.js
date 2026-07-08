require('dotenv').config();
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

async function testLogin() {
  try {
    // Check env vars
    console.log('=== Environment Check ===');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_DIALECT:', process.env.DB_DIALECT);
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
    console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
    console.log('PORT:', process.env.PORT);

    // Connect to database
    console.log('\n=== Database Connection ===');
    const sequelize = new Sequelize({
      dialect: process.env.DB_DIALECT || 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: true,
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      logging: false
    });

    await sequelize.authenticate();
    console.log('Database connection: OK');

    // Check Users table
    console.log('\n=== Users Check ===');
    const [users] = await sequelize.query('SELECT id, email, "firstName", "lastName", "roleId", "companyId", "isActive", "isVerified", password FROM "Users"');
    console.log('Total users:', users.length);
    if (users.length > 0) {
      users.forEach(u => {
        console.log(`- ${u.email} | active: ${u.isActive} | verified: ${u.isVerified} | roleId: ${u.roleId} | companyId: ${u.companyId}`);
        console.log(`  Password hash starts with: ${u.password.substring(0, 20)}...`);
      });
    } else {
      console.log('No users found!');
    }

    // Check Roles table
    console.log('\n=== Roles Check ===');
    const [roles] = await sequelize.query('SELECT id, name FROM "Roles"');
    console.log('Roles:', roles.length);
    roles.forEach(r => console.log(`- ${r.id}: ${r.name}`));

    // Check Companies table
    console.log('\n=== Companies Check ===');
    const [companies] = await sequelize.query('SELECT id, name FROM "Companies"');
    console.log('Companies:', companies.length);
    companies.forEach(c => console.log(`- ${c.id}: ${c.name}`));

    // Test password comparison
    if (users.length > 0) {
      console.log('\n=== Password Check ===');
      const isMatch = await bcrypt.compare('admin123', users[0].password);
      console.log('Password "admin123" matches stored hash:', isMatch);
    }

    await sequelize.close();
  } catch (err) {
    console.log('ERROR:', err.message);
    if (err.parent) console.log('DB Error:', err.parent.message);
  }
}

testLogin();