import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Unit extends Model {
  public id!: number;
  public name!: string;
  public abbreviation!: string;
  public description?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Unit.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  abbreviation: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'Units',
  timestamps: true
});

export default Unit;