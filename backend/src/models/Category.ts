import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Category extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
  public parentId?: number;
  public image?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init({
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
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Categories', key: 'id' }
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'Categories',
  timestamps: true
});

export default Category;