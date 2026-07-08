import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Brand extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
  public logo?: string;
  public website?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Brand.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
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
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'Brands',
  timestamps: true
});

export default Brand;