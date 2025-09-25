# Event Check-In System

A comprehensive event check-in system built with React.js frontend and NestJS backend, featuring QR code scanning, manual check-in, and a real-time admin dashboard.

## 🚀 Features

### ✅ Core Functionality
- **Dual Check-In Methods**: QR code scanning and manual ticket reference entry
- **Real-Time Dashboard**: Live statistics and ticket management
- **Multiple Ticket Types**: VIP, Standard, Student, Bundle Offer, Early Bird
- **Duplicate Prevention**: Prevents multiple check-ins for the same ticket
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📊 Dashboard Features
- **Total Attendance Overview**: Shows checked-in vs total tickets with progress bar
- **Ticket Type Statistics**: Individual progress tracking for each ticket type
- **Live Ticket Table**: Real-time view of all tickets with status updates
- **Auto-Refresh**: Dashboard updates every 30 seconds automatically

## 🛠 Tech Stack

### Frontend
- **React.js** - Modern JavaScript framework with JSX
- **Material-UI (MUI)** - Professional UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **QR Scanner** - Camera-based QR code scanning

### Backend
- **NestJS** - Scalable Node.js framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling
- **QRCode** - QR code generation library
- **UUID** - Unique identifier generation
- **Class Validator** - Request validation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local installation or MongoDB Compass)

## 🔧 Installation & Setup

### 1. Clone and Setup Project Structure
```bash
# The project structure should be:
event/
├── backend/     # NestJS backend
└── frontend/    # React frontend
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start MongoDB (if not already running)
# Make sure MongoDB is running on localhost:27017

# Start the backend server
npm run start:dev
```

The backend will:
- Start on `http://localhost:3001`
- Connect to MongoDB database `event-checkin`
- Automatically seed 15 sample tickets on first run

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will:
- Start on `http://localhost:3000`
- Automatically open in your default browser
- Connect to the backend API at `http://localhost:3001`

## 🎯 Usage Guide

### Check-In Process

1. **Navigate to Check-In**: Click "Check-In" in the navigation bar
2. **Choose Method**:
   - **QR Scan**: Click "QR Code Scan" tab, start camera, and scan QR codes
   - **Manual Entry**: Click "Manual Entry" tab and type the reference number
3. **Confirmation**: Success/error messages will display immediately

### Admin Dashboard

1. **Navigate to Dashboard**: Click "Dashboard" in the navigation bar
2. **View Statistics**: 
   - Total attendance overview at the top
   - Individual ticket type progress cards
   - Detailed ticket table at the bottom
3. **Real-Time Updates**: Dashboard refreshes every 30 seconds automatically

### Sample Ticket Reference Numbers
The system includes pre-seeded tickets. You can use any of these UUIDs for testing:
- Check the dashboard to see all available reference numbers
- Use the "Manual Entry" method to test with these numbers

## 🏗 Project Architecture

### Backend Structure
```
backend/src/
├── controllers/        # API route handlers
│   └── tickets.controller.ts
├── services/          # Business logic
│   ├── tickets.service.ts
│   └── seed.service.ts
├── schemas/           # Database models
│   └── ticket.schema.ts
├── dto/              # Data transfer objects
│   ├── checkin.dto.ts
│   └── response.dto.ts
└── main.ts           # Application entry point
```

### Frontend Structure
```
frontend/src/
├── components/        # React components
│   ├── Dashboard.jsx
│   ├── CheckIn.jsx
│   └── QRScanner.jsx
├── services/         # API communication
│   └── api.js
└── App.js           # Main application component
```

## 🔗 API Endpoints

### POST `/api/tickets/checkin`
Check in a ticket by reference number
```json
{
  "referenceNumber": "uuid-string"
}
```

### GET `/api/tickets`
Retrieve all tickets with their status

### GET `/api/tickets/stats`
Get attendance statistics by ticket type

## 🎨 Design Decisions

### Why MongoDB?
- **Schema Flexibility**: Easy to add new fields without migrations
- **JSON Native**: Seamless integration with Node.js and React
- **Scalability**: Horizontal scaling capabilities for large events

### Why NestJS?
- **Structured Architecture**: Built-in dependency injection and modular design
- **TypeScript Support**: Better code quality and developer experience
- **Decorators**: Clean, readable API definitions
- **Enterprise Ready**: Robust framework suitable for production applications

### Why Material-UI?
- **Professional Design**: Consistent, modern UI components
- **Responsive by Default**: Mobile-first design approach
- **Accessibility**: Built-in ARIA support and keyboard navigation
- **Customization**: Extensive theming capabilities

### Why React with JSX?
- **Component Reusability**: Modular, maintainable code structure
- **Virtual DOM**: Efficient rendering and performance
- **Large Ecosystem**: Extensive library support
- **Developer Experience**: Excellent tooling and debugging support

## 🚦 Development Notes

### Error Handling
- **Frontend**: User-friendly error messages with Material-UI Alert components
- **Backend**: Structured error responses with appropriate HTTP status codes
- **Validation**: Request validation using class-validator decorators

### Security Considerations
- **CORS Configuration**: Properly configured for local development
- **Input Validation**: All API inputs are validated
- **SQL Injection Prevention**: MongoDB's built-in protection

### Performance Optimizations
- **Auto-Refresh**: Configurable refresh intervals for real-time updates
- **Efficient Queries**: Optimized database queries for statistics
- **Component Optimization**: React best practices for rendering efficiency

## 🧪 Testing the System

1. **Start Both Servers**: Backend on :3001, Frontend on :3000
2. **Check Dashboard**: View pre-seeded tickets and statistics
3. **Test Check-In**: Use manual entry with a reference number from the dashboard
4. **Verify Updates**: Confirm dashboard reflects the check-in status change
5. **Test QR Scanner**: Use camera functionality (simulation mode)

## 🔮 Future Enhancements

- Real QR code scanning with actual QR code library integration
- Ticket printing functionality
- Advanced reporting and analytics
- Mobile app version
- Bulk check-in operations
- Event management features
- Integration with ticketing platforms

## 📞 Support

For technical issues or questions:
1. Check the browser console for error messages
2. Verify MongoDB is running and accessible
3. Ensure both frontend and backend servers are running
4. Check network connectivity between services

---

**Built with ❤️ using modern web technologies**