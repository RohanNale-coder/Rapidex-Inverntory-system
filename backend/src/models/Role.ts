import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Role extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
  public permissions!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  permissions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'Roles',
  timestamps: true
});

export default Role;