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
Since this is frontend-only deployment, no backend environment variables are needed for the initial deployment.

### 4. Deploy
Click "Deploy" and Vercel will:
- Install dependencies
- Build the React app
- Deploy to a `.vercel.app` URL

## Important Notes

### Backend Considerations
- The current deployment is **frontend-only**
- Backend API calls will need to be updated for production
- Consider using Vercel's serverless functions or deploy backend separately

### Production Checklist
- [ ] Frontend deployed to Vercel ✅
- [ ] Backend deployed (separate service needed)
- [ ] Environment variables configured
- [ ] Database hosted (production SQLite or PostgreSQL)
- [ ] API endpoints updated for production URLs

### Next Steps After Frontend Deployment
1. Deploy backend to a service like Railway, Render, or Heroku
2. Update API base URL in `src/services/api.js`
3. Set up production database
4. Configure CORS for production domains
5. Set up environment-specific configurations

## Current Status
✅ Code pushed to GitHub  
🔄 Ready for Vercel deployment  
⏳ Backend deployment pending
