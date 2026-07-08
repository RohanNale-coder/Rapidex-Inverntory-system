-- ============================================================
-- ERP Database Schema
-- Generated from Sequelize models
-- Database: PostgreSQL
-- ============================================================

BEGIN;

-- ============================================================
-- ENUM TYPE DEFINITIONS
-- ============================================================

CREATE TYPE order_status AS ENUM ('draft', 'pending', 'approved', 'ordered', 'received', 'cancelled');
CREATE TYPE invoice_status AS ENUM ('draft', 'pending', 'paid', 'partial', 'overdue', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid');
CREATE TYPE transaction_type AS ENUM ('purchase', 'sales', 'transfer', 'adjustment', 'return', 'scrap');
CREATE TYPE notification_type AS ENUM ('info', 'warning', 'error', 'success');
CREATE TYPE document_category AS ENUM ('product', 'purchase', 'sales', 'report', 'other');
CREATE TYPE audit_action AS ENUM ('create', 'read', 'update', 'delete', 'login', 'logout');
CREATE TYPE sales_order_status AS ENUM ('draft', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

-- ============================================================
-- TABLE CREATION ORDER (by dependency)
-- ============================================================

-- ============================================================
-- 1. COMPANIES (no dependencies)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Companies" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "postalCode" VARCHAR(20),
    "gstNumber" VARCHAR(50),
    "panNumber" VARCHAR(20),
    "logo" VARCHAR(500),
    "website" VARCHAR(255),
    "financialYearStart" VARCHAR(10) NOT NULL DEFAULT '04-01',
    "financialYearEnd" VARCHAR(10) NOT NULL DEFAULT '03-31',
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_companies_name" ON "Companies" ("name");

-- ============================================================
-- 2. ROLES (no dependencies)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Roles" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "description" TEXT,
    "permissions" TEXT,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. PERMISSIONS (no dependencies)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Permissions" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "description" TEXT,
    "module" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Junction: RolePermissions (Role <-> Permission)
-- ============================================================
CREATE TABLE IF NOT EXISTS "RolePermissions" (
    "id" SERIAL PRIMARY KEY,
    "roleId" INTEGER NOT NULL REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "permissionId" INTEGER NOT NULL REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("roleId", "permissionId")
);

CREATE INDEX IF NOT EXISTS "idx_role_permissions_role" ON "RolePermissions" ("roleId");
CREATE INDEX IF NOT EXISTS "idx_role_permissions_permission" ON "RolePermissions" ("permissionId");

-- ============================================================
-- 4. BRANCHES (depends on Companies)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Branches" (
    "id" SERIAL PRIMARY KEY,
    "companyId" INTEGER NOT NULL REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "postalCode" VARCHAR(20),
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "managerId" INTEGER REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_branches_company" ON "Branches" ("companyId");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_branches_code" ON "Branches" ("companyId", "code");

-- ============================================================
-- 5. USERS (depends on Roles, Companies, Branches)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "avatar" VARCHAR(500),
    "roleId" INTEGER NOT NULL REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "companyId" INTEGER NOT NULL REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "branchId" INTEGER REFERENCES "Branches"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "isActive" BOOLEAN DEFAULT TRUE,
    "isVerified" BOOLEAN DEFAULT FALSE,
    "lastLogin" TIMESTAMP WITH TIME ZONE,
    "passwordChangedAt" TIMESTAMP WITH TIME ZONE,
    "resetPasswordToken" VARCHAR(255),
    "resetPasswordExpire" TIMESTAMP WITH TIME ZONE,
    "twoFactorSecret" VARCHAR(255),
    "twoFactorEnabled" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_users_email" ON "Users" ("email");
CREATE INDEX IF NOT EXISTS "idx_users_company" ON "Users" ("companyId");
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "Users" ("roleId");
CREATE INDEX IF NOT EXISTS "idx_users_branch" ON "Users" ("branchId");

-- ============================================================
-- Now that Users exist, update Branches.managerId FK
-- (self-referencing FK deferred due to circular dependency)
-- ============================================================
ALTER TABLE "Branches" DROP CONSTRAINT IF EXISTS "Branches_managerId_fkey";
ALTER TABLE "Branches" ADD CONSTRAINT "Branches_managerId_fkey"
    FOREIGN KEY ("managerId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX IF NOT EXISTS "idx_branches_manager" ON "Branches" ("managerId");

-- ============================================================
-- 6. CATEGORIES (self-referencing)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Categories" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "parentId" INTEGER REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "image" VARCHAR(500),
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_categories_parent" ON "Categories" ("parentId");

-- ============================================================
-- 7. BRANDS (no deps)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Brands" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "logo" VARCHAR(500),
    "website" VARCHAR(255),
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Junction: CategoryBrands (Category <-> Brand)
-- ============================================================
CREATE TABLE IF NOT EXISTS "CategoryBrands" (
    "id" SERIAL PRIMARY KEY,
    "categoryId" INTEGER NOT NULL REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "brandId" INTEGER NOT NULL REFERENCES "Brands"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("categoryId", "brandId")
);

CREATE INDEX IF NOT EXISTS "idx_category_brands_category" ON "CategoryBrands" ("categoryId");
CREATE INDEX IF NOT EXISTS "idx_category_brands_brand" ON "CategoryBrands" ("brandId");

-- ============================================================
-- 8. UNITS (no deps)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Units" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "abbreviation" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 9. WAREHOUSES (depends on Companies, Users)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Warehouses" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL UNIQUE,
    "companyId" INTEGER NOT NULL REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "postalCode" VARCHAR(20),
    "managerId" INTEGER REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "capacity" INTEGER,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_warehouses_company" ON "Warehouses" ("companyId");
CREATE INDEX IF NOT EXISTS "idx_warehouses_code" ON "Warehouses" ("code");
CREATE INDEX IF NOT EXISTS "idx_warehouses_manager" ON "Warehouses" ("managerId");

-- ============================================================
-- 10. SUPPLIERS (depends on Companies)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Suppliers" (
    "id" SERIAL PRIMARY KEY,
    "companyId" INTEGER NOT NULL REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "postalCode" VARCHAR(20),
    "gstNumber" VARCHAR(50),
    "panNumber" VARCHAR(20),
    "contactPerson" VARCHAR(255),
    "creditLimit" DECIMAL(12, 2) DEFAULT 0,
    "currentBalance" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "rating" INTEGER,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_suppliers_company" ON "Suppliers" ("companyId");
CREATE INDEX IF NOT EXISTS "idx_suppliers_name" ON "Suppliers" ("name");

-- ============================================================
-- 11. CUSTOMERS (depends on Companies)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Customers" (
    "id" SERIAL PRIMARY KEY,
    "companyId" INTEGER NOT NULL REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "postalCode" VARCHAR(20),
    "gstNumber" VARCHAR(50),
    "panNumber" VARCHAR(20),
    "contactPerson" VARCHAR(255),
    "creditLimit" DECIMAL(12, 2) DEFAULT 0,
    "currentBalance" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "rating" INTEGER,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_customers_company" ON "Customers" ("companyId");
CREATE INDEX IF NOT EXISTS "idx_customers_name" ON "Customers" ("name");

-- ============================================================
-- 12. WAREHOUSE ZONES (depends on Warehouses)
-- ============================================================
CREATE TABLE IF NOT EXISTS "WarehouseZones" (
    "id" SERIAL PRIMARY KEY,
    "warehouseId" INTEGER NOT NULL REFERENCES "Warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_warehouse_zones_warehouse" ON "WarehouseZones" ("warehouseId");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_warehouse_zones_unique" ON "WarehouseZones" ("warehouseId", "code");

-- ============================================================
-- 13. WAREHOUSE RACKS (depends on WarehouseZones)
-- ============================================================
CREATE TABLE IF NOT EXISTS "WarehouseRacks" (
    "id" SERIAL PRIMARY KEY,
    "zoneId" INTEGER NOT NULL REFERENCES "WarehouseZones"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "capacity" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_warehouse_racks_zone" ON "WarehouseRacks" ("zoneId");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_warehouse_racks_unique" ON "WarehouseRacks" ("zoneId", "code");

-- ============================================================
-- 14. WAREHOUSE BINS (depends on WarehouseRacks)
-- ============================================================
CREATE TABLE IF NOT EXISTS "WarehouseBins" (
    "id" SERIAL PRIMARY KEY,
    "rackId" INTEGER NOT NULL REFERENCES "WarehouseRacks"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "capacity" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_warehouse_bins_rack" ON "WarehouseBins" ("rackId");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_warehouse_bins_unique" ON "WarehouseBins" ("rackId", "code");

-- ============================================================
-- 15. PRODUCTS (depends on Categories, Brands, Units)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Products" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(100) UNIQUE,
    "barcode" VARCHAR(100) UNIQUE,
    "description" TEXT,
    "categoryId" INTEGER NOT NULL REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "brandId" INTEGER REFERENCES "Brands"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "unitId" INTEGER NOT NULL REFERENCES "Units"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "purchasePrice" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "sellingPrice" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "mrp" DECIMAL(10, 2),
    "taxId" INTEGER,
    "hsnCode" VARCHAR(20),
    "minStockLevel" INTEGER NOT NULL DEFAULT 0,
    "maxStockLevel" INTEGER,
    "reorderLevel" INTEGER NOT NULL DEFAULT 10,
    "weight" DECIMAL(10, 2),
    "dimensions" VARCHAR(100),
    "isActive" BOOLEAN DEFAULT TRUE,
    "isSerialized" BOOLEAN DEFAULT FALSE,
    "isBatched" BOOLEAN DEFAULT FALSE,
    "expiryTracking" BOOLEAN DEFAULT FALSE,
    "warrantyPeriod" INTEGER,
    "images" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "idx_products_sku" ON "Products" ("sku");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_products_barcode" ON "Products" ("barcode");
CREATE INDEX IF NOT EXISTS "idx_products_category" ON "Products" ("categoryId");
CREATE INDEX IF NOT EXISTS "idx_products_brand" ON "Products" ("brandId");
CREATE INDEX IF NOT EXISTS "idx_products_unit" ON "Products" ("unitId");

-- ============================================================
-- 16. PURCHASE ORDERS (depends on Companies, Suppliers, Warehouses, Users)
-- ============================================================
CREATE TABLE IF NOT EXISTS "PurchaseOrders" (
    "id" SERIAL PRIMARY KEY,
    "poNumber" VARCHAR(50) NOT NULL UNIQUE,
    "companyId" INTEGER NOT NULL REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "supplierId" INTEGER NOT NULL REFERENCES "Suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "warehouseId" INTEGER NOT NULL REFERENCES "Warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "orderDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "expectedDate" TIMESTAMP WITH TIME ZONE,
    "status" order_status NOT NULL DEFAULT 'draft',
    "subtotal" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "approvedBy" INTEGER REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "approvedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_po_company" ON "PurchaseOrders" ("companyId");
CREATE INDEX IF NOT EXISTS "idx_po_supplier" ON "PurchaseOrders" ("supplierId");
CREATE INDEX IF NOT EXISTS "idx_po_warehouse" ON "PurchaseOrders" ("warehouseId");
CREATE INDEX IF NOT EXISTS "idx_po_approved_by" ON "PurchaseOrders" ("approvedBy");

-- ============================================================
-- 17. PURCHASE INVOICES (depends on Companies, PurchaseOrders, Suppliers, Warehouses)
-- ============================================================
CREATE TABLE IF NOT EXISTS "PurchaseInvoices" (
    "id" SERIAL PRIMARY KEY,
    "invoiceNumber" VARCHAR(50) NOT NULL UNIQUE,
    "companyId" INTEGER NOT NULL REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "purchaseOrderId" INTEGER REFERENCES "PurchaseOrders"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "supplierId" INTEGER NOT NULL REFERENCES "Suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "warehouseId" INTEGER NOT NULL REFERENCES "Warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "invoiceDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "dueDate" TIMESTAMP WITH TIME ZONE,
    "status" invoice_status NOT NULL DEFAULT 'draft',
    "subtotal" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "balanceAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "paymentStatus" payment_status NOT NULL DEFAULT 'unpaid',
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_pi_company" ON "PurchaseInvoices" ("companyId");
CREATE INDEX IF NOT EXISTS "idx_pi_supplier" ON "PurchaseInvoices" ("supplierId");
CREATE INDEX IF NOT EXISTS "idx_pi_warehouse" ON "PurchaseInvoices" ("warehouseId");
CREATE INDEX IF NOT EXISTS "idx_pi_po" ON "PurchaseInvoices" ("purchaseOrderId");

-- ============================================================
-- 18. SALES ORDERS (depends on Companies, Customers, Warehouses)
-- ============================================================
CREATE TABLE IF NOT EXISTS "SalesOrders" (
    "id" SERIAL PRIMARY KEY,
    "soNumber" VARCHAR(50) NOT NULL UNIQUE,
    "companyId" INTEGER NOT NULL REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "customerId" INTEGER NOT NULL REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "warehouseId" INTEGER NOT NULL REFERENCES "Warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "orderDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "expectedDate" TIMESTAMP WITH TIME ZONE,
    "status" sales_order_status NOT NULL DEFAULT 'draft',
    "subtotal" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_so_company" ON "SalesOrders" ("companyId");
CREATE INDEX IF NOT EXISTS "idx_so_customer" ON "SalesOrders" ("customerId");
CREATE INDEX IF NOT EXISTS "idx_so_warehouse" ON "SalesOrders" ("warehouseId");

-- ============================================================
-- 19. SALES INVOICES (depends on Companies, SalesOrders, Customers, Warehouses)
-- ============================================================
CREATE TABLE IF NOT EXISTS "SalesInvoices" (
    "id" SERIAL PRIMARY KEY,
    "invoiceNumber" VARCHAR(50) NOT NULL UNIQUE,
    "companyId" INTEGER NOT NULL REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "salesOrderId" INTEGER REFERENCES "SalesOrders"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "customerId" INTEGER NOT NULL REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "warehouseId" INTEGER NOT NULL REFERENCES "Warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "invoiceDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "dueDate" TIMESTAMP WITH TIME ZONE,
    "status" invoice_status NOT NULL DEFAULT 'draft',
    "subtotal" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "balanceAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "paymentStatus" payment_status NOT NULL DEFAULT 'unpaid',
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_si_company" ON "SalesInvoices" ("companyId");
CREATE INDEX IF NOT EXISTS "idx_si_customer" ON "SalesInvoices" ("customerId");
CREATE INDEX IF NOT EXISTS "idx_si_warehouse" ON "SalesInvoices" ("warehouseId");
CREATE INDEX IF NOT EXISTS "idx_si_sales_order" ON "SalesInvoices" ("salesOrderId");

-- ============================================================
-- 20. INVENTORY (depends on Products, Warehouses, WarehouseBins)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Inventory" (
    "id" SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "warehouseId" INTEGER NOT NULL REFERENCES "Warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "binId" INTEGER REFERENCES "WarehouseBins"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "reservedQuantity" INTEGER NOT NULL DEFAULT 0,
    "availableQuantity" INTEGER NOT NULL DEFAULT 0,
    "batchNumber" VARCHAR(100),
    "serialNumber" VARCHAR(100),
    "expiryDate" TIMESTAMP WITH TIME ZONE,
    "manufacturingDate" TIMESTAMP WITH TIME ZONE,
    "lastRestocked" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("productId", "warehouseId", "binId")
);

CREATE INDEX IF NOT EXISTS "idx_inventory_product" ON "Inventory" ("productId");
CREATE INDEX IF NOT EXISTS "idx_inventory_warehouse" ON "Inventory" ("warehouseId");
CREATE INDEX IF NOT EXISTS "idx_inventory_bin" ON "Inventory" ("binId");
CREATE INDEX IF NOT EXISTS "idx_inventory_batch" ON "Inventory" ("batchNumber");

-- ============================================================
-- 21. STOCK TRANSACTIONS (depends on Products, Warehouses, WarehouseBins)
-- ============================================================
CREATE TABLE IF NOT EXISTS "StockTransactions" (
    "id" SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "warehouseId" INTEGER NOT NULL REFERENCES "Warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "binId" INTEGER REFERENCES "WarehouseBins"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "transactionType" transaction_type NOT NULL,
    "quantity" INTEGER NOT NULL,
    "referenceType" VARCHAR(50),
    "referenceId" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_stocktx_product_warehouse" ON "StockTransactions" ("productId", "warehouseId");
CREATE INDEX IF NOT EXISTS "idx_stocktx_type" ON "StockTransactions" ("transactionType");
CREATE INDEX IF NOT EXISTS "idx_stocktx_created_at" ON "StockTransactions" ("createdAt");

-- ============================================================
-- 22. NOTIFICATIONS (depends on Users)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Notifications" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "type" notification_type NOT NULL DEFAULT 'info',
    "isRead" BOOLEAN DEFAULT FALSE,
    "readAt" TIMESTAMP WITH TIME ZONE,
    "data" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_notifications_user" ON "Notifications" ("userId");
CREATE INDEX IF NOT EXISTS "idx_notifications_unread" ON "Notifications" ("userId", "isRead");
CREATE INDEX IF NOT EXISTS "idx_notifications_created" ON "Notifications" ("createdAt");

-- ============================================================
-- 23. DOCUMENTS (depends on Users, Products)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Documents" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "fileName" VARCHAR(500) NOT NULL,
    "filePath" VARCHAR(500) NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "uploadedBy" INTEGER NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "productId" INTEGER REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "category" document_category NOT NULL DEFAULT 'other',
    "description" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_documents_uploaded_by" ON "Documents" ("uploadedBy");
CREATE INDEX IF NOT EXISTS "idx_documents_product" ON "Documents" ("productId");
CREATE INDEX IF NOT EXISTS "idx_documents_category" ON "Documents" ("category");

-- ============================================================
-- 24. AUDIT LOGS (depends on Users)
-- ============================================================
CREATE TABLE IF NOT EXISTS "AuditLogs" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "action" audit_action NOT NULL,
    "entityType" VARCHAR(100) NOT NULL,
    "entityId" INTEGER,
    "oldValues" TEXT,
    "newValues" TEXT,
    "ipAddress" VARCHAR(45),
    "userAgent" VARCHAR(500),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_auditlogs_user" ON "AuditLogs" ("userId");
CREATE INDEX IF NOT EXISTS "idx_auditlogs_entity" ON "AuditLogs" ("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "idx_auditlogs_created" ON "AuditLogs" ("createdAt");

-- ============================================================
-- GRANT STATEMENTS
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticator;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticator;

COMMIT;
