import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Product extends Model {
  public id!: number;
  public name!: string;
  public sku?: string;
  public barcode?: string;
  public description?: string;
  public categoryId!: number;
  public brandId?: number;
  public unitId!: number;
  public purchasePrice!: number;
  public sellingPrice!: number;
  public mrp?: number;
  public taxId?: number;
  public hsnCode?: string;
  public minStockLevel!: number;
  public maxStockLevel?: number;
  public reorderLevel!: number;
  public weight?: number;
  public dimensions?: string;
  public isActive!: boolean;
  public isSerialized!: boolean;
  public isBatched!: boolean;
  public expiryTracking!: boolean;
  public warrantyPeriod?: number;
  public images?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  barcode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Categories', key: 'id' }
  },
  brandId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Brands', key: 'id' }
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Units', key: 'id' }
  },
  purchasePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  sellingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  mrp: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  taxId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Taxes', key: 'id' }
  },
  hsnCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  minStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  maxStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reorderLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  dimensions: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isSerialized: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isBatched: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  expiryTracking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  warrantyPeriod: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'Products',
  timestamps: true,
  indexes: [
    { fields: ['sku'] },
    { fields: ['barcode'] },
    { fields: ['categoryId'] }
  ]
});

export default Product;