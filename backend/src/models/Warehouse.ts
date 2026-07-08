import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Warehouse extends Model {
  public id!: number;
  public name!: string;
  public code!: string;
  public companyId!: number;
  public address?: string;
  public city?: string;
  public state?: string;
  public country?: string;
  public postalCode?: string;
  public managerId?: number;
  public phone?: string;
  public email?: string;
  public capacity?: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Warehouse.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Companies', key: 'id' }
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
  managerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Users', key: 'id' }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'Warehouses',
  timestamps: true,
  indexes: [
    { fields: ['companyId'] },
    { fields: ['code'] }
  ]
});

export default Warehouse;