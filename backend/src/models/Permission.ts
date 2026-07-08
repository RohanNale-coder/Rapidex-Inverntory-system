import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Permission extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
  public module!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Permission.init({
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
  module: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'Permissions',
  timestamps: true
});

export default Permission;