import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Inventory extends Model {
  public id!: number;
  public productId!: number;
  public warehouseId!: number;
  public binId?: number;
  public quantity!: number;
  public reservedQuantity!: number;
  public availableQuantity!: number;
  public batchNumber?: string;
  public serialNumber?: string;
  public expiryDate?: Date;
  public manufacturingDate?: Date;
  public lastRestocked?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Inventory.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Products', key: 'id' }
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Warehouses', key: 'id' }
  },
  binId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'WarehouseBins', key: 'id' }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  reservedQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  availableQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  batchNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  serialNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  manufacturingDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastRestocked: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'Inventory',
  timestamps: true,
  indexes: [
    { fields: ['productId', 'warehouseId'], unique: true },
    { fields: ['warehouseId'] },
    { fields: ['batchNumber'] }
  ]
});

export default Inventory;