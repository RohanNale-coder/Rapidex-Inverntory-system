import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import companyRoutes from './routes/company';
import productRoutes from './routes/products';
import warehouseRoutes from './routes/warehouses';
import supplierRoutes from './routes/suppliers';
import customerRoutes from './routes/customers';
import purchaseRoutes from './routes/purchase';
import salesRoutes from './routes/sales';
import inventoryRoutes from './routes/inventory';
import notificationRoutes from './routes/notifications';
import documentRoutes from './routes/documents';
import settingsRoutes from './routes/settings';
import auditRoutes from './routes/audit';
import helpRoutes from './routes/help';
import dashboardRoutes from './routes/dashboard';
import { initializeSocket } from './services/socketService';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
app.use(rateLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React frontend (if build exists)
app.use(express.static('../frontend/build'));

// Serve simple HTML page for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Error handler
app.use(errorHandler);

export default app;