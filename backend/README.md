# Inventory ERP System - Backend

A comprehensive SAP-like ERP system built with Node.js, Express, TypeScript, and Sequelize ORM.

## Features

- **Authentication & Authorization**: JWT-based auth with RBAC
- **Multi-Company Support**: Manage multiple companies and branches
- **Product Management**: Complete product lifecycle with variants, barcodes, and batch tracking
- **Warehouse Management**: Multi-warehouse support with zones, racks, and bins
- **Purchase Management**: Purchase orders, invoices, and vendor management
- **Sales Management**: Sales orders, invoices, and customer management
- **Inventory Management**: Real-time stock tracking, adjustments, and transfers
- **Reporting**: Comprehensive reports with PDF/Excel export
- **Audit Trail**: Complete activity logging and tracking
- **Notifications**: Real-time notifications and alerts

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (easily upgradable to PostgreSQL/MySQL)
- **ORM**: Sequelize
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
backend/
├── src/
│   ├── config/           # Database and app configuration
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── uploads/              # File uploads directory
├── package.json
├── tsconfig.json
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration

4. Run database migrations (if using migrations):
```bash
npm run migrate
```

5. Start development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Warehouses
- `GET /api/warehouses` - Get all warehouses
- `POST /api/warehouses` - Create warehouse
- `PUT /api/warehouses/:id` - Update warehouse
- `DELETE /api/warehouses/:id` - Delete warehouse

### Purchase
- `GET /api/purchase/orders` - Get purchase orders
- `POST /api/purchase/orders` - Create purchase order
- `GET /api/purchase/invoices` - Get purchase invoices
- `POST /api/purchase/invoices` - Create purchase invoice

### Sales
- `GET /api/sales/orders` - Get sales orders
- `POST /api/sales/orders` - Create sales order
- `GET /api/sales/invoices` - Get sales invoices
- `POST /api/sales/invoices` - Create sales invoice

### Inventory
- `GET /api/inventory/stock` - Get current stock
- `POST /api/inventory/adjust` - Adjust stock
- `GET /api/inventory/transactions` - Get stock transactions

### Reports
- `GET /api/reports/sales` - Sales reports
- `GET /api/reports/purchase` - Purchase reports
- `GET /api/reports/inventory` - Inventory reports
- `GET /api/reports/financial` - Financial reports

## Database Schema

The system uses the following main entities:
- Users & Roles
- Companies & Branches
- Products, Categories, Brands, Units
- Warehouses, Zones, Racks, Bins
- Suppliers & Customers
- Purchase Orders & Invoices
- Sales Orders & Invoices
- Inventory & Stock Transactions
- Notifications & Documents
- Audit Logs

## Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Rate Limiting
- CORS Protection
- Helmet Security Headers
- Role-Based Access Control (RBAC)
- Input Validation

## Development

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

## License

MIT