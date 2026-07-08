# How to Start the ERP System

## Prerequisites
- Node.js v18+ installed
- npm installed

## Step-by-Step Startup

### 1. Open Command Prompt/Terminal in the project folder
```bash
cd d:/rapidex/inventory-erp
```

### 2. Install Dependencies (First Time Only)
```bash
npm run install:all
```
This installs backend and frontend dependencies.

### 3. Build Frontend
```bash
npm run build
```
This creates the React build folder.

### 4. Start the Server
```bash
npm start
```
This starts the backend server on port 5000.

### 5. Open Browser
Go to: http://localhost:5000

## Quick Start (All in One)
```bash
npm run dev
```
This builds frontend and starts the server automatically.

## Troubleshooting

### "react-scripts is not recognized"
**Solution**: Run `npm run install:all` first to install frontend dependencies.

### "Cannot find module"
**Solution**: Make sure you ran `npm run install:all` in the root folder.

### Port 5000 already in use
**Solution**: 
1. Stop the other application using port 5000
2. Or change PORT in `backend/.env` file

### Database errors
**Solution**: The SQLite database is created automatically. Check write permissions in the backend folder.

## What Each Command Does

- `npm run install:all` - Installs all dependencies (backend + frontend)
- `npm run build` - Builds the React frontend into static files
- `npm start` - Starts the backend server (serves both API and frontend)
- `npm run dev` - Builds frontend and starts server (recommended)
- `setup.bat` - Windows batch script that does everything automatically

## Default Login
- Email: `admin@erp.com`
- Password: `admin123`

## Access Points
- Main App: http://localhost:5000
- API Health: http://localhost:5000/health
- API Docs: http://localhost:5000/api

## Need Help?
Check SETUP.md for detailed instructions.