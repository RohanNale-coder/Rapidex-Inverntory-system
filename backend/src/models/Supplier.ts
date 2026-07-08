import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Supplier extends Model {
  public id!: number;
  public companyId!: number;
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
  public contactPerson?: string;
  public creditLimit?: number;
  public currentBalance!: number;
  public rating?: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Supplier.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Companies', key: 'id' }
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
  contactPerson: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  creditLimit: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0
  },
  currentBalance: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'Suppliers',
  timestamps: true,
  indexes: [
    { fields: ['companyId'] },
    { fields: ['name'] }
  ]
});

export default Supplier;