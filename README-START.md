postgresql://authenticator:npg_ydC8YzLM0Sqj@ep-hidden-leaf-a15vmojh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=requireu# 🚀 START HERE - Inventory ERP System

## The System is Complete and Ready to Run!

### ⚡ Quick Start (3 Steps)

```bash
# Step 1: Install dependencies (REQUIRED - do this first!)
npm run install:all

# Step 2: Start the application
npm run dev

# Step 3: Open browser
# Go to: http://localhost:5000
```

---

## 📋 What You Need to Know

### ✅ What's Been Built
- Complete ERP system with 17 modules
- Backend API (Node.js + Express + TypeScript)
- Frontend (React + TypeScript)
- Database (SQLite - auto-created)
- All models, routes, and configurations
- Single port deployment (port 5000)

### ⚠️ Important: Dependencies Must Be Installed First!

**Before running the app, you MUST install dependencies:**

```bash
npm run install:all
```

This installs:
- Backend packages (Express, Sequelize, etc.)
- Frontend packages (React, Material-UI, etc.)

**Without this step, the application will NOT run!**

---

## 🎯 Step-by-Step Instructions

### First Time Setup:

1. **Open Command Prompt** in the project folder:
   ```
   cd d:/rapidex/inventory-erp
   ```

2. **Install all dependencies** (this may take 5-10 minutes):
   ```bash
   npm run install:all
   ```
   
   You should see:
   - "added XXX packages" for root
   - "added XXX packages" for backend
   - "added XXX packages" for frontend

3. **Start the application**:
   ```bash
   npm run dev
   ```
   
   You should see:
   - "Server running on port 5000"

4. **Open your browser**:
   ```
   http://localhost:5000
   ```

---

## 🔧 If You Get Errors

### Error: "react-scripts is not recognized"
**This means frontend dependencies aren't installed yet.**

**Solution:**
```bash
npm run install:all
```

### Error: "Cannot find module 'express'"
**This means backend dependencies aren't installed yet.**

**Solution:**
```bash
npm run install:all
```

### Error: "Port 5000 already in use"
**Solution:** Change the port in `backend/.env`:
```
PORT=5001
```

### Error: "EACCES" or permission denied
**Solution:** Run Command Prompt as Administrator

---

## 📚 Documentation Files

- **README-START.md** (this file) - Quick start guide
- **HOW-TO-RUN.md** - Detailed running instructions
- **START.md** - Simple startup guide
- **QUICKSTART.md** - Quick reference
- **SETUP.md** - Complete setup documentation
- **README.md** - Full project documentation

---

## 🎓 System Overview

### Architecture
- **Single Port**: Everything runs on port 5000
- **Backend**: Express.js server serves API + frontend
- **Frontend**: React app (built as static files)
- **Database**: SQLite (automatically created)

### Access Points
- **Main App**: http://localhost:5000
- **API Health**: http://localhost:5000/health
- **API**: http://localhost:5000/api

### Default Login
- Email: `admin@erp.com`
- Password: `admin123`

---

## ✅ Verification Checklist

After running `npm run install:all`, verify:

- [ ] `node_modules` folder exists in root
- [ ] `backend/node_modules` folder exists
- [ ] `frontend/node_modules` folder exists
- [ ] `backend/.env` file exists

After running `npm run dev`, verify:

- [ ] Server starts without errors
- [ ] Message shows "Server running on port 5000"
- [ ] Can access http://localhost:5000/health
- [ ] Can access http://localhost:5000

---

## 🆘 Still Not Working?

### Complete Reset:
```bash
# 1. Stop any running servers (Ctrl+C)

# 2. Delete node_modules folders
rd /s /q node_modules
rd /s /q backend\node_modules
rd /s /q frontend\node_modules

# 3. Reinstall everything
npm run install:all

# 4. Build frontend
npm run build

# 5. Start server
npm start
```

### Check Node.js Version:
```bash
node --version
```
Should be v18 or higher

### Check npm Version:
```bash
npm --version
```
Should be v8 or higher

---

## 📞 Support

If you're still having issues:

1. Read **HOW-TO-RUN.md** for detailed troubleshooting
2. Check the terminal output for specific error messages
3. Verify all steps in this guide were followed
4. Try the complete reset procedure above

---

## 🎉 You're Ready!

Once you see "Server running on port 5000", open your browser and go to:
**http://localhost:5000**

The ERP system is now running!

---

**Remember**: The #1 mistake is not running `npm run install:all` first!