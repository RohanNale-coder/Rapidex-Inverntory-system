import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Document extends Model {
  public id!: number;
  public name!: string;
  public fileName!: string;
  public filePath!: string;
  public fileSize!: number;
  public mimeType!: string;
  public uploadedBy!: number;
  public productId?: number;
  public category!: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Document.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fileName: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Products', key: 'id' }
  },
  category: {
    type: DataTypes.ENUM('product', 'purchase', 'sales', 'report', 'other'),
    allowNull: false,
    defaultValue: 'other'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'Documents',
  timestamps: true,
  indexes: [
    { fields: ['uploadedBy'] },
    { fields: ['productId'] },
    { fields: ['category'] }
  ]
});

export default Document;