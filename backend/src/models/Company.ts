import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Company extends Model {
  public id!: number;
  public name!: string;
  public email?: string;
  public phone?: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public country?: string;
  public postalCode?: string;
  public gstNumber?: string;
  public panNumber?: string;
  public logo?: string;
  public website?: string;
  public financialYearStart!: string;
  public financialYearEnd!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Company.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  postalCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  gstNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  panNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  logo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  financialYearStart: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: '04-01'
  },
  financialYearEnd: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: '03-31'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'Companies',
  timestamps: true
});

export default Company;