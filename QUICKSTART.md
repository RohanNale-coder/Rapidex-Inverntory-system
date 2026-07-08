# Quick Start - Single Port (5000)

## Run the Application

### First Time Setup
```bash
# Step 1: Install all dependencies (backend + frontend)
npm run install:all

# Step 2: Build frontend and start backend server
npm run dev
```

### Subsequent Runs
```bash
# Just start the server (frontend already built)
npm run dev
```

## Important Notes

- **First run**: Must execute `npm run install:all` to install dependencies
- **react-scripts error**: If you see "react-scripts is not recognized", frontend isn't installed yet. Run `npm run install:all`
- **Single port**: Everything runs on http://localhost:5000

## Access the Application

Open your browser and go to:
- **Main App**: http://localhost:5000
- **API Health**: http://localhost:5000/health

## What Happens

1. Frontend is built into static files
2. Backend server starts on port 5000
3. Backend serves:
   - React app at http://localhost:5000
   - API at http://localhost:5000/api
   - Everything on a single port!

## Default Credentials

- Email: `admin@erp.com`
- Password: `admin123`

## Stop the Server

Press `Ctrl+C` in the terminal

## Need Help?

See `SETUP.md` for detailed setup instructions.
See `README.md` for complete documentation.