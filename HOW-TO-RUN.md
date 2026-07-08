# How to Run the Inventory ERP System

## ⚠️ IMPORTANT: Follow These Steps Exactly

### Step 1: Install Dependencies (First Time Only)
```bash
npm run install:all
```
**This is required!** Without this, the application won't run.

### Step 2: Start the Application
```bash
npm run dev
```

### Step 3: Open Browser
Go to: **http://localhost:5000**

---

## Common Issues and Solutions

### ❌ Error: "react-scripts is not recognized"
**Cause**: Frontend dependencies not installed  
**Solution**: Run `npm run install:all` first

### ❌ Error: "Cannot find module"
**Cause**: Dependencies not installed  
**Solution**: Run `npm run install:all` in the root folder

### ❌ Error: "Port 5000 already in use"
**Solution**: 
1. Stop the other application using port 5000, OR
2. Change the port in `backend/.env`:
   ```
   PORT=5001
   ```

### ❌ Error: "EACCES" or permission errors
**Solution**: Run command prompt as Administrator

---

## Complete Setup from Scratch

If you're having issues, follow this complete setup:

```bash
# 1. Navigate to project folder
cd d:/rapidex/inventory-erp

# 2. Remove old dependencies (if any)
rd /s /q node_modules
rd /s /q backend/node_modules
rd /s /q frontend/node_modules

# 3. Install all dependencies
npm run install:all

# 4. Build frontend
npm run build

# 5. Start server
npm start
```

---

## What the Commands Do

| Command | What It Does |
|---------|-------------|
| `npm run install:all` | Installs backend + frontend dependencies |
| `npm run build` | Builds React frontend into static files |
| `npm start` | Starts backend server on port 5000 |
| `npm run dev` | Builds frontend + starts server (recommended) |
| `setup.bat` | Windows script that does everything |

---

## Access Points

Once running, you can access:
- **Main Application**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **API Endpoints**: http://localhost:5000/api/*

---

## Default Login Credentials

After starting the application, you can register a new user or use:
- **Email**: `admin@erp.com`
- **Password**: `admin123`

---

## System Architecture

```
Port 5000
├── Backend API (Express.js)
│   ├── /api/* - REST API endpoints
│   ├── /health - Health check
│   └── Serves React frontend
│
└── Frontend (React)
    └── Served as static files by backend
```

---

## Quick Test

After starting the server, test if it's working:

1. **Test Backend**: Visit http://localhost:5000/health
   - Should show: `{"status":"ok"}`

2. **Test Frontend**: Visit http://localhost:5000
   - Should show the ERP system login page

3. **Test API**: Visit http://localhost:5000/api/health
   - Should show: `{"status":"ok"}`

---

## Still Not Working?

### Check 1: Verify Node.js Installation
```bash
node --version
npm --version
```
Should show v18+ for Node.js

### Check 2: Verify Dependencies Installed
```bash
# Check if these folders exist:
dir node_modules
dir backend\node_modules
dir frontend\node_modules
```

### Check 3: Verify Frontend Build
```bash
# Check if build folder exists:
dir frontend\build
```

### Check 4: Check for Errors
Look at the terminal output for specific error messages.

---

## Alternative: Run Backend Only (Development Mode)

If you want to develop with hot reloading:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (separate):**
```bash
cd frontend
npm start
```

Then update `frontend/src/context/AuthContext.tsx`:
```typescript
axios.defaults.baseURL = 'http://localhost:5000/api';
```

---

## Need More Help?

- See `SETUP.md` for detailed setup instructions
- See `README.md` for complete documentation
- See `QUICKSTART.md` for quick reference

---

## Summary

**The #1 reason the app doesn't run is:**
> Dependencies not installed!

**Solution**: Always run `npm run install:all` first, then `npm run dev`