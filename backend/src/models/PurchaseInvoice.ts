import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class PurchaseInvoice extends Model {
  public id!: number;
  public invoiceNumber!: string;
  public companyId!: number;
  public purchaseOrderId?: number;
  public supplierId!: number;
  public warehouseId!: number;
  public invoiceDate!: Date;
  public dueDate?: Date;
  public status!: string;
  public subtotal!: number;
  public taxAmount!: number;
  public discountAmount!: number;
  public totalAmount!: number;
  public paidAmount!: number;
  public balanceAmount!: number;
  public paymentStatus!: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PurchaseInvoice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  invoiceNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Companies', key: 'id' }
  },
  purchaseOrderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'PurchaseOrders', key: 'id' }
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
  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'paid', 'partial', 'overdue', 'cancelled'),
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
  paidAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  balanceAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'partial', 'paid'),
    allowNull: false,
    defaultValue: 'unpaid'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'PurchaseInvoices',
  timestamps: true,
  indexes: [
    { fields: ['companyId'] },
    { fields: ['supplierId'] },
    { fields: ['invoiceNumber'] }
  ]
});

export default PurchaseInvoice;