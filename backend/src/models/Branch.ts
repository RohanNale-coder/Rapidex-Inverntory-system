import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Branch extends Model {
  public id!: number;
  public companyId!: number;
  public name!: string;
  public code!: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public country?: string;
  public postalCode?: string;
  public phone?: string;
  public email?: string;
  public managerId?: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Branch.init({
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
  code: {
    type: DataTypes.STRING(50),
    allowNull: false
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
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  managerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Users', key: 'id' }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'Branches',
  timestamps: true,
  indexes: [
    { fields: ['companyId'] },
    { fields: ['code'] }
  ]
});

export default Branch;