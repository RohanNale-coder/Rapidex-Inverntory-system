# Inventory ERP System - Frontend

A comprehensive SAP-like ERP system frontend built with React, TypeScript, and Material-UI.

## Features

- **Authentication**: Login, Register, Forgot Password, OTP verification
- **Dashboard**: Executive dashboard with KPIs, graphs, and analytics
- **Company Management**: Multi-company and branch management
- **User Management**: Users, roles, permissions, departments
- **Product Management**: Complete product lifecycle with variants, barcodes, batch tracking
- **Warehouse Management**: Multi-warehouse with zones, racks, bins
- **Supplier Management**: Supplier profiles, ledgers, payments
- **Customer Management**: Customer profiles, ledgers, payments
- **Purchase Module**: Purchase orders, invoices, GRN, returns
- **Sales Module**: Sales orders, invoices, delivery notes, returns
- **Inventory Module**: Stock management, adjustments, transfers, batch tracking
- **Reports**: Comprehensive reporting with PDF/Excel export
- **Notifications**: Real-time notifications and alerts
- **Documents**: File management and document archive
- **Settings**: System configuration and preferences
- **Audit Module**: Complete audit trail and activity logs
- **Help Center**: User guides, FAQs, and support

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Data Fetching**: React Query (TanStack Query)
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios
- **Date Handling**: Moment.js
- **Utilities**: Lodash

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── features/           # Feature-based modules
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── products/       # Product management
│   │   ├── warehouses/     # Warehouse management
│   │   ├── purchase/       # Purchase module
│   │   ├── sales/          # Sales module
│   │   ├── inventory/      # Inventory module
│   │   ├── reports/        # Reports module
│   │   ├── settings/       # Settings pages
│   │   └── ...
│   ├── components/         # Reusable components
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   ├── context/            # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
└── tsconfig.json
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

2. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Features Overview

### Authentication
- Login/Register
- Forgot/Reset Password
- OTP Verification
- Session Management
- User Profile

### Dashboard
- Executive Dashboard
- KPI Cards
- Sales/Purchase Graphs
- Low Stock Alerts
- Today's Orders
- Pending Orders
- Recent Activity
- Quick Actions

### Product Management
- Product List with Search/Filter
- Add/Edit Product
- Product Details
- Product Images
- Categories & Subcategories
- Brands
- Units & Taxes
- HSN Codes
- Barcode/QR Code Generation
- Product Variants
- Batch Tracking
- Expiry Tracking

### Warehouse Management
- Warehouse List
- Add/Edit Warehouse
- Warehouse Zones, Racks, Bins
- Stock Transfer
- Warehouse Settings

### Purchase Management
- Purchase Requisition
- Purchase Quotation
- Purchase Order
- Goods Receipt Note (GRN)
- Purchase Invoice
- Purchase Return
- Vendor Payment

### Sales Management
- Sales Quotation
- Sales Order
- Delivery Note
- Sales Invoice
- Sales Return
- Customer Payment

### Inventory Management
- Stock Overview
- Stock Ledger
- Stock Adjustment
- Stock Transfer
- Batch Management
- Serial Numbers
- Cycle Count
- Physical Verification

### Reports
- Sales Reports
- Purchase Reports
- Inventory Reports
- Financial Reports
- PDF/Excel Export
- Custom Reports

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api`. All API calls are made using Axios with proper authentication headers.

## State Management

- **AuthContext**: Manages user authentication state
- **ThemeContext**: Manages dark/light theme
- **React Query**: Manages server state and caching

## UI Components

Built with Material-UI components for a professional, SAP-like interface:
- Data Grids for tables
- Forms with validation
- Charts and graphs
- Modals and dialogs
- Notifications and alerts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT