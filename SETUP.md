# Setup Guide - Inventory ERP System

## Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation & Running

#### Single Port Setup (Port 5000)
The application runs both backend API and frontend on a single port (5000).

```bash
# Install all dependencies
npm run install:all

# Build frontend and start backend server
npm run dev
```

This will start the complete application at:
- **Application**: http://localhost:5000
- **API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

#### Manual Setup

**Step 1: Install Dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

**Step 2: Build Frontend**
```bash
npm run build
```

**Step 3: Start Backend Server**
```bash
npm start
```

The application will be available at http://localhost:5000

## Architecture

### Single Port Deployment
The application uses a unified architecture where:
- **Backend** (Express.js) serves both API and frontend
- **Frontend** (React) is built as static files
- **Port**: 5000 serves everything

### API Connection
The frontend connects to the backend API using relative paths:
- **API Base URL**: `/api` (relative, same origin)
- **Full URL**: `http://localhost:5000/api`

### CORS Configuration
Since frontend and backend are served from the same origin, CORS is simplified.

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:3000,http://localhost:5000
```

### Frontend
The frontend uses the proxy configuration in `package.json` to route API requests to the backend.

## Testing the Application

1. Start the server: `npm run dev`
2. Visit http://localhost:5000 - Should show the login page
3. Visit http://localhost:5000/health - Should return `{"status":"ok"}`
4. The frontend makes API calls to http://localhost:5000/api

## Default Login

After setting up the database, you can register a new user or use:
- Email: `admin@erp.com`
- Password: `admin123`

## How It Works

1. **Build Process**: Frontend React app is built into static files
2. **Server**: Backend Express server serves:
   - API endpoints at `/api/*`
   - Static frontend files for all other routes
   - React app handles client-side routing
3. **Single Port**: Everything runs on port 5000

## Troubleshooting

### Backend won't start
- Ensure Node.js v18+ is installed
- Check if port 5000 is available
- Verify `.env` file exists in backend folder

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify proxy setting in `frontend/package.json`

### Database errors
- SQLite database will be created automatically
- Check write permissions in backend folder

## Production Build

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build

# Start production server
cd backend
npm start
```

## Project Structure

```
inventory-erp/
├── backend/          # Node.js/Express API server (port 5000)
├── frontend/         # React application (port 3000)
├── package.json      # Root package with startup scripts
└── README.md         # Main documentation
```

## API Endpoints

All API endpoints are prefixed with `/api`:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `GET /api/users` - Get all users
- `GET /api/products` - Get all products
- `GET /api/warehouses` - Get all warehouses
- `GET /api/suppliers` - Get all suppliers
- `GET /api/customers` - Get all customers
- `GET /api/purchase/orders` - Get purchase orders
- `GET /api/sales/orders` - Get sales orders
- `GET /api/inventory/stock` - Get current stock
- `GET /api/dashboard/stats` - Get dashboard statistics
- And many more...

## Support

For issues or questions, refer to the main README.md file.