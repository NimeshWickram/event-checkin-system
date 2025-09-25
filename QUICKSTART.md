# Event Check-In System - Quick Start Guide

## Prerequisites Check
- [ ] Node.js installed (v16+)
- [ ] MongoDB running on localhost:27017
- [ ] Two terminal windows ready

## Step 1: Start Backend
```bash
cd backend
npm run start:dev
```
Wait for: "Application is running on: http://localhost:3001"

## Step 2: Start Frontend (New Terminal)
```bash
cd frontend
npm start
```
Wait for: Browser opens to http://localhost:3000

## Step 3: Test the System
1. Open http://localhost:3000 in your browser
2. Click "Dashboard" to see seeded tickets
3. Click "Check-In" to test manual entry
4. Use any reference number from the dashboard table

## Sample Test Data
The system automatically creates 15 sample tickets with different types:
- VIP tickets
- Standard tickets  
- Student tickets
- Bundle Offer tickets
- Early Bird tickets

## Troubleshooting
- **Backend won't start**: Check if MongoDB is running
- **Frontend won't start**: Make sure port 3000 is available
- **API errors**: Verify backend is running on port 3001
- **Database empty**: Restart backend to re-seed data

## Quick Test Commands
Test the API directly:
```bash
# Get all tickets
curl http://localhost:3001/api/tickets

# Get statistics  
curl http://localhost:3001/api/tickets/stats

# Check in a ticket (replace UUID with actual reference)
curl -X POST http://localhost:3001/api/tickets/checkin \
  -H "Content-Type: application/json" \
  -d '{"referenceNumber":"your-uuid-here"}'
```