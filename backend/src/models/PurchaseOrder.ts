import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class PurchaseOrder extends Model {
  public id!: number;
  public poNumber!: string;
  public companyId!: number;
  public supplierId!: number;
  public warehouseId!: number;
  public orderDate!: Date;
  public expectedDate?: Date;
  public status!: string;
  public subtotal!: number;
  public taxAmount!: number;
  public discountAmount!: number;
  public totalAmount!: number;
  public notes?: string;
  public approvedBy?: number;
  public approvedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PurchaseOrder.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  poNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Companies', key: 'id' }
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Suppliers', key: 'id' }
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Warehouses', key: 'id' }
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  expectedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft'
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  taxAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  discountAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Users', key: 'id' }
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'PurchaseOrders',
  timestamps: true,
  indexes: [
    { fields: ['companyId'] },
    { fields: ['supplierId'] },
    { fields: ['poNumber'] }
  ]
});

export default PurchaseOrder;