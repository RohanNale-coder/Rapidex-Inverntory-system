import http from 'http';
import app from './app';
import { connectDB } from './config/database';
import dotenv from 'dotenv';
import db from './models';
import bcrypt from 'bcryptjs';
import { initializeSocket } from './services/socketService';

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();
    await db.sequelize.sync({ force: false, alter: false }).catch((e: any) => console.error('Sync warning:', e.message));
    console.log('Database synced');

    try {
      const roleCount = await db.Role.count();
      if (roleCount === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await db.Company.create({ name: 'Default Company', financialYearStart: '04-01', financialYearEnd: '03-31' });
        await db.Role.create({ name: 'Admin', description: 'Administrator', permissions: 'all' });
        await db.User.create({ email: 'admin@erp.com', password: hashedPassword, firstName: 'Admin', lastName: 'User', roleId: 1, companyId: 1, isActive: true, isVerified: true });
        
        // Seed default categories, brands, and units
        await db.Category.bulkCreate([
          { name: 'Electronics', description: 'Electronic items' },
          { name: 'Clothing', description: 'Apparel and clothing' },
          { name: 'Food', description: 'Food and beverages' }
        ]);
        await db.Brand.bulkCreate([
          { name: 'Generic', description: 'Generic brand' }
        ]);
        await db.Unit.bulkCreate([
          { name: 'Piece', abbreviation: 'pcs' },
          { name: 'Kilogram', abbreviation: 'kg' },
          { name: 'Liter', abbreviation: 'L' }
        ]);
        console.log('Default data seeded');
        console.log('Default admin user created: admin@erp.com / admin123');
      }
    } catch (e: any) {
      console.error('Seed warning:', e.message);
    }

    const server = http.createServer(app);
    initializeSocket(server);
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
