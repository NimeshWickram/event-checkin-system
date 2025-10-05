# Deploying to Vercel

This document explains how to deploy the frontend to Vercel.

## Prerequisites

1. A Vercel account (free at [vercel.com](https://vercel.com))
2. The backend API deployed and running (see backend deployment instructions)

## Deployment Steps

1. Go to [vercel.com](https://vercel.com) and sign in/up
2. Click "New Project"
3. Import this frontend repository or upload the frontend folder
4. Configure the project:
   - Framework Preset: Create React App
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variables (if needed):
   - `REACT_APP_API_BASE_URL`: URL of your deployed backend API
6. Deploy!

## Environment Variables

For local development:
```
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

For production:
```
REACT_APP_API_BASE_URL=https://your-backend-url.com/api
```

## Important Notes

- The frontend and backend must be deployed separately
- Make sure CORS is properly configured on your backend to allow requests from your Vercel domain
- Update the backend CORS configuration to include your Vercel deployment URL