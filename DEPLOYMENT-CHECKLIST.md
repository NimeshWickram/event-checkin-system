# Deployment Checklist

## Pre-deployment

- [ ] Create MongoDB Atlas account and cluster
- [ ] Get MongoDB connection string
- [ ] Prepare environment variables
- [ ] Test application locally with production-like settings
- [ ] Commit all changes to repository

## Backend Deployment

- [ ] Choose hosting platform (Render, Railway, etc.)
- [ ] Create new web service
- [ ] Connect repository or upload code
- [ ] Set environment variables:
  - [ ] `MONGODB_URI`
  - [ ] `FRONTEND_URL`
  - [ ] `NODE_ENV=production`
- [ ] Configure build command: `npm install`
- [ ] Configure start command: `npm run start:prod`
- [ ] Deploy and verify backend is running
- [ ] Test API endpoints directly

## Frontend Deployment (Vercel)

- [ ] Create Vercel account
- [ ] Create new project
- [ ] Connect repository or upload frontend code
- [ ] Configure project settings:
  - [ ] Framework: Create React App
  - [ ] Root directory: frontend
- [ ] Set environment variables:
  - [ ] `REACT_APP_API_BASE_URL`
- [ ] Deploy and verify frontend is accessible
- [ ] Test frontend functionality

## Post-deployment

- [ ] Update backend CORS to include Vercel URL
- [ ] Test end-to-end functionality
- [ ] Verify all API calls are working
- [ ] Check for any console errors
- [ ] Test check-in functionality
- [ ] Verify dashboard statistics
- [ ] Test both QR scanner and manual entry

## Monitoring

- [ ] Set up error tracking (if needed)
- [ ] Configure uptime monitoring
- [ ] Set up log monitoring
- [ ] Configure performance monitoring

## Security

- [ ] Verify MongoDB connection is secure
- [ ] Check that sensitive data is not exposed
- [ ] Ensure HTTPS is used for all communications
- [ ] Review CORS settings
- [ ] Update passwords/secrets if using defaults

## Backup and Recovery

- [ ] Set up MongoDB backups
- [ ] Document deployment process
- [ ] Create rollback plan
- [ ] Test recovery procedures