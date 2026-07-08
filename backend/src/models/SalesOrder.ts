import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class SalesOrder extends Model {
  public id!: number;
  public soNumber!: string;
  public companyId!: number;
  public customerId!: number;
  public warehouseId!: number;
  public orderDate!: Date;
  public expectedDate?: Date;
  public status!: string;
  public subtotal!: number;
  public taxAmount!: number;
  public discountAmount!: number;
  public totalAmount!: number;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SalesOrder.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  soNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Companies', key: 'id' }
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Customers', key: 'id' }
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
    type: DataTypes.ENUM('draft', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
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
  }
}, {
  sequelize,
  tableName: 'SalesOrders',
  timestamps: true,
  indexes: [
    { fields: ['companyId'] },
    { fields: ['customerId'] },
    { fields: ['soNumber'] }
  ]
});

export default SalesOrder;