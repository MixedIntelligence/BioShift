# Vercel Deployment Setup

## Quick Deployment Steps

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your `BioShift` repository
5. Select the `BioShiftv9` branch

### 2. Configuration
Vercel should automatically detect this as a React app. Use these settings:

**Framework Preset:** Create React App
**Root Directory:** `./` (root)
**Build Command:** `npm run build`
**Output Directory:** `build`
**Install Command:** `npm install`

### 3. Environment Variables
The frontend requires the following environment variable to connect to the backend API:

`REACT_APP_API_URL=https://bioshift-production.up.railway.app`

### 4. Deploy
Click "Deploy" and Vercel will:
- Install dependencies
- Build the React app
- Deploy to a `.vercel.app` URL

## Important Notes

### Backend Deployment
The backend is deployed separately on **Railway**. The frontend is configured to send API requests to the live Railway URL.

### Production Checklist
- [ ] Frontend deployed to Vercel ✅
- [ ] Backend deployed (separate service needed)
- [ ] Environment variables configured
- [ ] Database hosted (production SQLite or PostgreSQL)
- [ ] API endpoints updated for production URLs

### Deployment Status
- **Frontend**: Deployed and live on Vercel.
- **Backend**: Deployed and live on Railway.
- **Database**: Production PostgreSQL database is running on Railway.
- **CORS**: Configured for production domains.

## Current Status
✅ Code pushed to GitHub  
🔄 Ready for Vercel deployment  
⏳ Backend deployment pending
