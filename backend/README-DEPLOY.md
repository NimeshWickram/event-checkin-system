# Deploying the Backend

This document explains how to deploy the backend to various cloud platforms.

## Supported Platforms

The backend can be deployed to any platform that supports Node.js applications:
- Render
- Railway
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service

## Environment Variables

You need to set the following environment variables:

```
MONGODB_URI=mongodb://your-mongodb-connection-string
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=3001
```

## Deployment to Render (Recommended)

1. Create a Render account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository or upload your code
4. Set the following configuration:
   - Build Command: `npm install`
   - Start Command: `npm run start:prod`
   - Environment Variables:
     - `NODE_ENV=production`
     - `MONGODB_URI=your-mongodb-uri`
     - `FRONTEND_URL=https://your-vercel-app.vercel.app`
5. Add a MongoDB database (you can use MongoDB Atlas for free tier)
6. Deploy!

## Deployment to Other Platforms

### General Steps:
1. Build the application: `npm run build`
2. Set environment variables as needed
3. Start the application: `npm run start:prod`

### Environment Variables Details:
- `MONGODB_URI`: Your MongoDB connection string (required)
- `FRONTEND_URL`: The URL of your frontend application (for CORS)
- `PORT`: Port to run the application on (defaults to 3001)

## Database Migration

The application automatically seeds sample data on first run. For production, you might want to:
1. Disable automatic seeding in production
2. Use your own data migration strategy

To disable seeding in production, modify the seed service or use an environment variable to control it.

## Health Check Endpoint

The application exposes a health check endpoint at the root path (`/`) which returns a simple JSON response.

## API Documentation

The API endpoints are:
- `POST /api/tickets/checkin` - Check in a ticket
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/stats` - Get ticket statistics
- `GET /api/tickets/finance` - Get finance statistics