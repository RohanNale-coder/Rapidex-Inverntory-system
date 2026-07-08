import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: (process.env.DB_DIALECT as 'postgres' | 'sqlite') || 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true',
  dialectOptions: process.env.DB_SSL === 'true' ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export default sequelize;