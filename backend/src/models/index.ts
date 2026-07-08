import { Sequelize } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Role from './Role';
import Permission from './Permission';
import Company from './Company';
import Branch from './Branch';
import Product from './Product';
import Category from './Category';
import Brand from './Brand';
import Unit from './Unit';
import Warehouse from './Warehouse';
import WarehouseZone from './WarehouseZone';
import WarehouseRack from './WarehouseRack';
import WarehouseBin from './WarehouseBin';
import Supplier from './Supplier';
import Customer from './Customer';
import PurchaseOrder from './PurchaseOrder';
import PurchaseInvoice from './PurchaseInvoice';
import SalesOrder from './SalesOrder';
import SalesInvoice from './SalesInvoice';
import Inventory from './Inventory';
import StockTransaction from './StockTransaction';
import Notification from './Notification';
import Document from './Document';
import AuditLog from './AuditLog';

const db: any = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// User Management
db.User = User;
db.Role = Role;
db.Permission = Permission;

// Company Management
db.Company = Company;
db.Branch = Branch;

// Product Management
db.Product = Product;
db.Category = Category;
db.Brand = Brand;
db.Unit = Unit;

// Warehouse Management
db.Warehouse = Warehouse;
db.WarehouseZone = WarehouseZone;
db.WarehouseRack = WarehouseRack;
db.WarehouseBin = WarehouseBin;

// Supplier & Customer
db.Supplier = Supplier;
db.Customer = Customer;

// Purchase & Sales
db.PurchaseOrder = PurchaseOrder;
db.PurchaseInvoice = PurchaseInvoice;
db.SalesOrder = SalesOrder;
db.SalesInvoice = SalesInvoice;

// Inventory
db.Inventory = Inventory;
db.StockTransaction = StockTransaction;

// Other
db.Notification = Notification;
db.Document = Document;
db.AuditLog = AuditLog;

// Associations
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.belongsToMany(Permission, { through: 'RolePermissions' });
User.belongsTo(Company, { foreignKey: 'companyId' });
User.belongsTo(Branch, { foreignKey: 'branchId' });

Company.hasMany(Branch, { foreignKey: 'companyId' });
Branch.belongsTo(Company, { foreignKey: 'companyId' });

Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.belongsTo(Brand, { foreignKey: 'brandId' });
Product.belongsTo(Unit, { foreignKey: 'unitId' });
Category.belongsToMany(Brand, { through: 'CategoryBrands' });

Warehouse.belongsTo(Company, { foreignKey: 'companyId' });
Warehouse.hasMany(WarehouseZone, { foreignKey: 'warehouseId' });
WarehouseZone.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
WarehouseZone.hasMany(WarehouseRack, { foreignKey: 'zoneId' });
WarehouseRack.belongsTo(WarehouseZone, { foreignKey: 'zoneId' });
WarehouseRack.hasMany(WarehouseBin, { foreignKey: 'rackId' });
WarehouseBin.belongsTo(WarehouseRack, { foreignKey: 'rackId' });

Supplier.belongsTo(Company, { foreignKey: 'companyId' });
Customer.belongsTo(Company, { foreignKey: 'companyId' });

PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplierId' });
PurchaseOrder.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
PurchaseInvoice.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId' });

SalesOrder.belongsTo(Customer, { foreignKey: 'customerId' });
SalesOrder.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
SalesInvoice.belongsTo(SalesOrder, { foreignKey: 'salesOrderId' });

Product.hasMany(Inventory, { foreignKey: 'productId' });
Inventory.belongsTo(Product, { foreignKey: 'productId' });
Inventory.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Inventory.belongsTo(WarehouseBin, { foreignKey: 'binId' });

StockTransaction.belongsTo(Product, { foreignKey: 'productId' });
StockTransaction.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Notification.belongsTo(User, { foreignKey: 'userId' });

Document.belongsTo(User, { foreignKey: 'uploadedBy' });
Document.belongsTo(Product, { foreignKey: 'productId' });

AuditLog.belongsTo(User, { foreignKey: 'userId' });

export default db;