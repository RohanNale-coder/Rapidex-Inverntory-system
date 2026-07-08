# Database Configuration - PostgreSQL (Neon)

## Database Connection

The system is configured to connect to PostgreSQL on Neon.tech.

### Connection Details
- **Host**: ep-hidden-leaf-a15vmojh-pooler.ap-southeast-1.aws.neon.tech
- **Port**: 5432
- **Database**: neondb
- **Username**: authenticator
- **Password**: npg_ydC8YzLM0Sqj
- **SSL**: Required (enabled)

### Configuration Location
Database connection is configured in `backend/.env`:
```env
DB_DIALECT=postgres
DB_HOST=ep-hidden-leaf-a15vmojh-pooler.ap-southeast-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=authenticator
DB_PASSWORD=npg_ydC8YzLM0Sqj
DB_SSL=true
```

## Database Schema

The system uses Sequelize ORM with the following models:

### Core Models
1. **User** - System users with authentication
2. **Role** - User roles (Admin, Manager, Staff, etc.)
3. **Permission** - Granular permissions
4. **Company** - Company information
5. **Branch** - Company branches

### Product Management
6. **Category** - Product categories
7. **Brand** - Product brands
8. **Unit** - Measurement units
9. **Product** - Main product information

### Warehouse Management
10. **Warehouse** - Warehouse locations
11. **WarehouseZone** - Warehouse zones
12. **WarehouseRack** - Warehouse racks
13. **WarehouseBin** - Warehouse bins

### Partner Management
14. **Supplier** - Supplier information
15. **Customer** - Customer information

### Transaction Management
16. **PurchaseOrder** - Purchase orders
17. **PurchaseInvoice** - Purchase invoices
18. **SalesOrder** - Sales orders
19. **SalesInvoice** - Sales invoices

### Inventory Management
20. **Inventory** - Stock levels
21. **StockTransaction** - Stock movements

### System
22. **Notification** - System notifications
23. **Document** - File documents
24. **AuditLog** - Audit trail logs

## Database Setup

### Automatic Setup
The database tables are created automatically when you start the application:
```bash
npm run dev
```

Sequelize will sync all models to the PostgreSQL database.

### Manual Setup (Optional)
If you need to manually create tables:
```bash
cd backend
npm run migrate
```

## Database Connection Test

To test the database connection:
```bash
node test-connection.js
```

Or visit: http://localhost:5000/health

## Switching Databases

### From SQLite to PostgreSQL
Already configured! Just update `backend/.env` with your PostgreSQL credentials.

### From PostgreSQL to SQLite
Update `backend/.env`:
```env
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite
```

## Data Persistence

- **PostgreSQL (Neon)**: Data is stored in the cloud
- **SQLite**: Data is stored in `backend/database.sqlite` file

## Backup & Restore

### PostgreSQL Backup
```bash
pg_dump -h ep-hidden-leaf-a15vmojh-pooler.ap-southeast-1.aws.neon.tech -U authenticator neondb > backup.sql
```

### PostgreSQL Restore
```bash
psql -h ep-hidden-leaf-a15vmojh-pooler.ap-southeast-1.aws.neon.tech -U authenticator neondb < backup.sql
```

## Troubleshooting

### Connection Failed
1. Verify PostgreSQL credentials in `backend/.env`
2. Check if Neon database is active
3. Ensure SSL is enabled (DB_SSL=true)
4. Check network connectivity

### Authentication Error
1. Verify username and password
2. Check if user has necessary permissions
3. Ensure database exists

### SSL Error
The connection requires SSL. Ensure `DB_SSL=true` is set in `.env`.

## Connection String Format

For reference, the connection string is:
```
postgresql://authenticator:npg_ydC8YzLM0Sqj@ep-hidden-leaf-a15vmojh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

## Security Notes

- Never commit `backend/.env` to version control
- Use environment variables for sensitive data
- Rotate passwords regularly
- Enable SSL for all connections (already configured)
- Use strong JWT secrets in production