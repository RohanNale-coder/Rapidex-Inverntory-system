require('dotenv').config();
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    const { sequelize } = require('./src/models');
    
    // Check if admin exists
    const [results] = await sequelize.query('SELECT * FROM "Users" WHERE email = \'admin@erp.com\'');
    
    if (results.length === 0) {
      console.log('Admin user not found. Creating...');
      
      // Get or create company
      const [companies] = await sequelize.query('SELECT * FROM "Companies" LIMIT 1');
      let companyId = 1;
      if (companies.length === 0) {
        const [newCompany] = await sequelize.query('INSERT INTO "Companies" (name, financialYearStart, financialYearEnd, isActive, "createdAt", "updatedAt") VALUES (\'Default Company\', \'04-01\', \'03-31\', true, NOW(), NOW()) RETURNING id');
        companyId = newCompany[0].id;
        console.log('Created company with ID:', companyId);
      } else {
        companyId = companies[0].id;
      }

      // Get or create role
      const [roles] = await sequelize.query('SELECT * FROM "Roles" WHERE name = \'Admin\' LIMIT 1');
      let roleId = 1;
      if (roles.length === 0) {
        const [newRole] = await sequelize.query('INSERT INTO "Roles" (name, description, permissions, "createdAt", "updatedAt") VALUES (\'Admin\', \'Administrator\', \'all\', NOW(), NOW()) RETURNING id');
        roleId = newRole[0].id;
        console.log('Created Admin role with ID:', roleId);
      } else {
        roleId = roles[0].id;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Create admin user
      await sequelize.query(
        'INSERT INTO "Users" (email, password, "firstName", "lastName", "roleId", "companyId", "isActive", "isVerified", "createdAt", "updatedAt") VALUES (\'admin@erp.com\', \'' + hashedPassword + '\', \'Admin\', \'User\', ' + roleId + ', ' + companyId + ', true, true, NOW(), NOW())'
      );
      
      console.log('Admin user created successfully!');
      console.log('Email: admin@erp.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Create default categories, brands, and units if they don't exist
    const [categories] = await sequelize.query('SELECT * FROM "Categories" LIMIT 1');
    if (categories.length === 0) {
      await sequelize.query('INSERT INTO "Categories" (name, description, "createdAt", "updatedAt") VALUES (\'Electronics\', \'Electronic items\', NOW(), NOW())');
      await sequelize.query('INSERT INTO "Categories" (name, description, "createdAt", "updatedAt") VALUES (\'Clothing\', \'Apparel and clothing\', NOW(), NOW())');
      await sequelize.query('INSERT INTO "Categories" (name, description, "createdAt", "updatedAt") VALUES (\'Food\', \'Food and beverages\', NOW(), NOW())');
      console.log('Default categories created');
    }

    const [brands] = await sequelize.query('SELECT * FROM "Brands" LIMIT 1');
    if (brands.length === 0) {
      await sequelize.query('INSERT INTO "Brands" (name, description, "createdAt", "updatedAt") VALUES (\'Generic\', \'Generic brand\', NOW(), NOW())');
      console.log('Default brand created');
    }

    const [units] = await sequelize.query('SELECT * FROM "Units" LIMIT 1');
    if (units.length === 0) {
      await sequelize.query('INSERT INTO "Units" (name, abbreviation, "createdAt", "updatedAt") VALUES (\'Piece\', \'pcs\', NOW(), NOW())');
      await sequelize.query('INSERT INTO "Units" (name, abbreviation, "createdAt", "updatedAt") VALUES (\'Kilogram\', \'kg\', NOW(), NOW())');
      await sequelize.query('INSERT INTO "Units" (name, abbreviation, "createdAt", "updatedAt") VALUES (\'Liter\', \'L\', NOW(), NOW())');
      console.log('Default units created');
    }

    console.log('Database seeded successfully!');
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.log('Error:', err.message);
    process.exit(1);
  }
}

seedAdmin();