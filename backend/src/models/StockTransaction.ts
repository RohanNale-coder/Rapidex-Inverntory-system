import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class StockTransaction extends Model {
  public id!: number;
  public productId!: number;
  public warehouseId!: number;
  public binId?: number;
  public transactionType!: string;
  public quantity!: number;
  public referenceType?: string;
  public referenceId?: number;
  public notes?: string;
  public readonly createdAt!: Date;
}

StockTransaction.init({
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
  transactionType: {
    type: DataTypes.ENUM('purchase', 'sales', 'transfer', 'adjustment', 'return', 'scrap'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  referenceType: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  referenceId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'StockTransactions',
  timestamps: true,
  createdAt: true,
  updatedAt: false,
  indexes: [
    { fields: ['productId', 'warehouseId'] },
    { fields: ['transactionType'] },
    { fields: ['createdAt'] }
  ]
});

export default StockTransaction;