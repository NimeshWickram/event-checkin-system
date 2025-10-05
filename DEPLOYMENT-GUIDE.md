# Full Project Deployment Guide

This guide explains how to deploy both the frontend and backend of the Event Check-In System.

## Architecture Overview

The application consists of:
1. **Frontend**: React application (to be deployed to Vercel)
2. **Backend**: NestJS API server (to be deployed to a Node.js hosting platform)
3. **Database**: MongoDB (can use MongoDB Atlas free tier)

## Deployment Architecture

```
[User] → [Vercel Frontend] → [Backend API Server] → [MongoDB]
```

## Step 1: Database Setup

1. Create a MongoDB Atlas account: https://www.mongodb.com/atlas/database
2. Create a free cluster
3. Create a database user
4. Add your IP address to the IP whitelist (or allow access from anywhere for development)
5. Get your connection string

## Step 2: Backend Deployment

### Option A: Deploy to Render (Recommended)

1. Go to https://render.com and create an account
2. Create a new "Web Service"
3. Connect your repository or upload the backend code
4. Configure settings:
   - Name: event-checkin-backend
   - Region: Choose the closest to your users
   - Build Command: `npm install`
   - Start Command: `npm run start:prod`
5. Add environment variables:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   FRONTEND_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   ```
6. Click "Create Web Service"

### Option B: Deploy to Railway

1. Go to https://railway.app and create an account
2. Create a new project
3. Provision a MongoDB database or use your Atlas connection string
4. Add a new service and deploy your backend code
5. Set the same environment variables as above

## Step 3: Frontend Deployment to Vercel

1. Go to https://vercel.com and create an account
2. Create a new project
3. Import your repository or upload the frontend code
4. Configure project settings:
   - Framework Preset: Create React App
   - Root Directory: frontend
5. Add environment variables:
   ```
   REACT_APP_API_BASE_URL=https://your-backend-url.com/api
   ```
6. Deploy!

## Step 4: Update CORS Configuration

After deploying your backend, update the [backend/src/main.ts](file:///c%3A/Users/tharu/Desktop/event/backend/src/main.ts) file to include your Vercel frontend URL in the CORS configuration:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://your-vercel-app.vercel.app'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

## Environment Variables Summary

### Backend Environment Variables
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-checkin
FRONTEND_URL=https://your-vercel-frontend.vercel.app
NODE_ENV=production
PORT=3001
```

### Frontend Environment Variables
```
REACT_APP_API_BASE_URL=https://your-backend-api.com/api
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend CORS configuration includes your Vercel frontend URL
2. **Database Connection**: Verify your MongoDB connection string is correct
3. **API Not Responding**: Check that your backend is running and accessible
4. **Environment Variables**: Ensure all required environment variables are set

### Checking Deployment Status

1. **Backend**: Visit your backend URL directly to see if it responds
2. **Frontend**: Check the browser console for any errors
3. **Network**: Use browser dev tools to check if API requests are being made correctly

## Scaling Considerations

For production use:
1. Use a paid MongoDB plan for better performance
2. Consider adding a CDN for the frontend
3. Implement proper logging and monitoring
4. Add authentication and authorization as needed
5. Set up automated backups for your database

## Cost Estimates

With the recommended setup:
- MongoDB Atlas (Free tier): $0/month
- Vercel (Free tier): $0/month
- Render (Free tier): $0/month (with some limitations)

Total estimated cost: $0/month for development/testing