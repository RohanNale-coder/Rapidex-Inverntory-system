# Inventory ERP System

A comprehensive, SAP-like Enterprise Resource Planning (ERP) system built with modern technologies. This system provides complete business process management for inventory, sales, purchase, and financial operations.

## 🏗️ Architecture

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: SQLite (upgradable to PostgreSQL/MySQL)
- **ORM**: Sequelize
- **Authentication**: JWT with refresh tokens
- **Security**: Helmet, CORS, Rate Limiting, RBAC

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **State Management**: React Context + React Query
- **Charts**: Recharts
- **Forms**: React Hook Form

## 📊 System Modules

### 1. Authentication & Authorization (8 Pages)
- Login
- Register
- Forgot Password
- Reset Password
- Verify OTP
- Change Password
- User Profile
- Session Management

### 2. Dashboard (8 Pages)
- Executive Dashboard
- Warehouse Dashboard
- Purchase Dashboard
- Sales Dashboard
- Inventory Dashboard
- Financial Summary
- KPI Dashboard
- Custom Dashboards

**Features**: KPI Cards, Sales/Purchase Graphs, Low Stock Alerts, Today's Orders, Pending Orders, Recent Activity, Quick Actions

### 3. Company Management (5 Pages)
- Company Details
- Branches
- Financial Year
- Business Settings
- Company Preferences

### 4. User Management (10 Pages)
- Users List
- Create User
- Edit User
- User Profile
- Roles
- Permissions
- Departments
- Designations
- Activity Logs
- Login History

### 5. Product Management (18 Pages)
- Product List
- Add/Edit Product
- Product Details
- Product Images
- Categories & Subcategories
- Brands
- Units
- Taxes
- HSN Codes
- Barcode/QR Code
- Product Pricing
- Product Variants
- Product Bundles
- Product History
- Product Import

**Features**: Barcode, QR Code, Multiple Units, GST, Product Variants, Batch Tracking, Expiry Tracking

### 6. Warehouse Management (10 Pages)
- Warehouse List
- Add/Edit Warehouse
- Warehouse Details
- Warehouse Zones
- Warehouse Racks
- Warehouse Bins
- Warehouse Transfer
- Warehouse Settings
- Warehouse Stock
- Warehouse Reports

### 7. Supplier Management (8 Pages)
- Supplier List
- Add/Edit Supplier
- Supplier Details
- Supplier Ledger
- Supplier Payments
- Purchase History
- Supplier Rating
- Supplier Documents

### 8. Customer Management (9 Pages)
- Customer List
- Add/Edit Customer
- Customer Details
- Customer Ledger
- Customer Payments
- Sales History
- Credit Limits
- Customer Documents
- Customer Statements

### 9. Purchase Module (15 Pages)
- Purchase Requisition
- Purchase Quotation
- Purchase Order
- Purchase Approval
- Goods Receipt Note (GRN)
- Purchase Invoice
- Purchase Return
- Vendor Payment
- Purchase History
- Pending Purchases
- Purchase Reports
- Purchase Analytics
- Attachments
- Approval History
- Audit Trail

### 10. Sales Module (15 Pages)
- Sales Quotation
- Sales Order
- Delivery Note
- Sales Invoice
- Sales Return
- Customer Payment
- Pending Deliveries
- Sales History
- Sales Reports
- Sales Analytics
- Price Lists
- Discounts
- Offers
- Audit Trail
- Attachments

### 11. Inventory Module (18 Pages)
- Stock Overview
- Current Stock
- Stock Ledger
- Stock Adjustment
- Stock Transfer
- Batch Management
- Serial Numbers
- Inventory Transactions
- Inventory Valuation
- Cycle Count
- Physical Verification
- Damaged Stock
- Scrap Stock
- Reserved Stock
- Reorder List
- Stock Aging
- Inventory Reports
- Inventory Analytics

### 12. Reports (20 Pages)
- Dashboard Reports
- Product Reports
- Sales Reports
- Purchase Reports
- Inventory Reports
- Warehouse Reports
- Supplier Reports
- Customer Reports
- Tax Reports
- Profit/Loss Reports
- Stock Valuation
- Inventory Aging
- Batch Report
- Expiry Report
- User Report
- Audit Report
- Login Report
- Export Center
- Custom Reports

### 13. Notifications (5 Pages)
- Notifications List
- Alerts
- Low Stock Alerts
- Expiry Alerts
- Notification Settings

### 14. Documents (6 Pages)
- File Manager
- Upload Files
- Product Images
- Purchase Documents
- Sales Documents
- Reports Archive

### 15. Settings (15 Pages)
- General Settings
- Company Settings
- Warehouse Settings
- Tax Settings
- Email Settings
- SMS Settings
- Notification Settings
- Backup & Restore
- Themes
- Localization
- Currency
- Numbering Series
- Audit Settings
- API Keys

### 16. Audit Module (5 Pages)
- Audit Logs
- User Logs
- System Logs
- Login Logs
- Activity History

### 17. Help Center (5 Pages)
- User Guide
- FAQs
- Contact Support
- Feedback
- About

## 🚀 Enterprise Features

### Authentication
- ✅ JWT Authentication
- ✅ Refresh Tokens
- ✅ RBAC (Roles & Permissions)
- ✅ Session Management
- ✅ Password Policies
- 🔜 Multi-factor Authentication (future)

### Inventory Management
- ✅ Multi-Warehouse
- ✅ Batch Management
- ✅ Serial Number Tracking
- ✅ Barcode & QR Codes
- ✅ Reorder Levels
- ✅ Expiry Tracking
- ✅ Stock Valuation
- ✅ Physical Stock Verification

### Purchasing
- ✅ Purchase Workflow
- ✅ Approvals
- ✅ GRN
- ✅ Returns
- ✅ Vendor Payments

### Sales
- ✅ Quotations
- ✅ Orders
- ✅ Delivery Notes
- ✅ Invoices
- ✅ Returns
- ✅ Customer Payments

### Reporting
- ✅ Charts & Dashboards
- ✅ PDF Export
- ✅ Excel Export
- ✅ CSV Export

### Security
- ✅ Role-Based Access Control
- ✅ Audit Logs
- ✅ Activity Logs
- ✅ File Permissions

### Integrations (Future)
- 🔜 Email
- 🔜 SMS
- 🔜 WhatsApp
- 🔜 Barcode Scanners
- 🔜 Label Printers
- 🔜 Payment Gateway
- 🔜 Accounting Software

## 📦 Project Structure

```
inventory-erp/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Database & app configuration
│   │   ├── models/         # Sequelize ORM models (25+ models)
│   │   ├── routes/         # API route handlers (17 route files)
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic services
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── uploads/            # File upload directory
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/               # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── features/       # Feature-based modules
│   │   │   ├── auth/       # Authentication pages
│   │   │   ├── dashboard/  # Dashboard pages
│   │   │   ├── products/   # Product management
│   │   │   ├── warehouses/ # Warehouse management
│   │   │   ├── purchase/   # Purchase module
│   │   │   ├── sales/      # Sales module
│   │   │   ├── inventory/  # Inventory module
│   │   │   ├── reports/    # Reports module
│   │   │   ├── settings/   # Settings pages
│   │   │   └── ...
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context providers
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── docs/                   # Documentation
├── scripts/                # Utility scripts
└── README.md               # This file
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Language**: TypeScript 5.3+
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Sequelize 6.35+
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, bcryptjs, express-rate-limit
- **File Upload**: Multer
- **Email**: Nodemailer
- **SMS**: Twilio
- **Barcode/QR**: bwip-js, qrcode
- **PDF Generation**: PDFKit
- **Excel Export**: ExcelJS
- **Real-time**: Socket.IO
- **Scheduling**: node-cron
- **Logging**: Winston

### Frontend
- **Framework**: React 18.2+
- **Language**: TypeScript 5.3+
- **UI Library**: Material-UI 5.15+
- **Routing**: React Router v6.20+
- **State Management**: React Context API
- **Data Fetching**: React Query v3.39+
- **Charts**: Recharts 2.10+
- **Forms**: React Hook Form 7.48+
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios
- **Date Handling**: Moment.js
- **Utilities**: Lodash
- **Barcode**: react-barcode
- **QR Code**: qrcode.react
- **Camera**: react-html5-camera-photo

## 📊 Estimated Size

- **Modules**: 17
- **Pages**: ~180
- **REST APIs**: 150-200
- **Database Tables**: 40-50
- **React Components**: 250+
- **Backend Services**: 100+
- **User Roles**: Admin, Manager, Warehouse Staff, Sales, Purchase, Accountant, Viewer

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd inventory-erp
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## 📝 Development

### Backend Scripts
```bash
npm run dev      # Start development server with nodemon
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server
npm run migrate  # Run database migrations
npm run seed     # Seed database
```

### Frontend Scripts
```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
npm run eject    # Eject from CRA
```

## 🔐 Default Credentials

After setup, you can register a new user or use the default admin account (if seeded):
- Email: admin@erp.com
- Password: admin123

## 📄 License

MIT License

## 👥 User Roles

1. **Admin**: Full system access
2. **Manager**: Management level access
3. **Warehouse Staff**: Warehouse operations
4. **Sales**: Sales module access
5. **Purchase**: Purchase module access
6. **Accountant**: Financial operations
7. **Viewer**: Read-only access

## 🔮 Future Enhancements

- Multi-factor Authentication (MFA)
- Email & SMS Notifications
- WhatsApp Integration
- Barcode Scanner Integration
- Label Printer Support
- Payment Gateway Integration
- Accounting Software Integration
- Advanced Analytics & AI
- Mobile App (React Native)
- Multi-language Support
- Advanced Reporting with Drill-down

## 📞 Support

For support and queries:
- Email: support@inventory-erp.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

---

**Built with ❤️ for efficient business management**