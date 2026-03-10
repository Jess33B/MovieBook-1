# Movie Booking System

A professional cinema booking platform with advanced features including multilingual support, theater seat selection, and premium UI/UX.

## Features

### Movie Management
- Browse movies with high-quality posters
- Advanced search and filtering
- Movie details with ratings and descriptions
- Genre-based categorization

### Seat Selection
- Interactive theater layout
- Visual seat map with color coding
- Real-time price calculation
- Multiple theater options

### Booking System
- Show time selection
- Add-on services (food, parking)
- Real-time pricing
- Booking confirmation

### Authentication
- User registration and login
- Admin panel access
- Role-based permissions
- Session management

### Analytics Dashboard
- Sentiment analysis
- Sales data and predictions
- Keyword extraction
- User behavior insights

## Tech Stack

### Frontend
- React 18 with hooks
- React Router v6 for navigation
- Axios for API calls
- CSS with custom styling

### Backend
- Node.js with Express
- Mock database for development
- JWT-like authentication
- RESTful API endpoints

## Quick Start

### 1. Backend Setup
```bash
cd backend
node mock-server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 3. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Admin Login: http://localhost:3000/simple-admin-login

## Authentication

### Admin Credentials
- Username: admin
- Password: 123

### User Registration
- Visit /simple-register to create new account
- Visit /simple-login for user login

## API Endpoints

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/validate - Token validation

### Movies
- GET /api/movies - Get all movies
- GET /api/movies/:id - Get movie by ID

### Analytics
- GET /api/analytics/dashboard - Dashboard data
- GET /api/analytics/sentiment/:movieId - Sentiment analysis
- GET /api/analytics/sales - Sales data
- GET /api/analytics/predictions - AI predictions
- GET /api/analytics/keywords/:movieId - Keyword analysis

## Movie Collection

1. The Matrix (Sci-Fi) - $250
2. Inception (Sci-Fi) - $280
3. The Dark Knight (Action) - $300
4. Kumbalangi Nights (Drama) - $320
5. Joseph (Drama) - $290

## Project Structure

```
movie-booking-system/
├── backend/
│   ├── mock-server.js          # Express server with API endpoints
│   └── package.json           # Backend dependencies
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── context/           # React context
│   │   ├── services/          # API services
│   │   └── App.js             # Main app component
│   └── package.json           # Frontend dependencies
└── README.md                   # This file
```

## Features Implemented

### Complete Authentication System
- Simple login/registration forms
- Admin panel with analytics
- Session management
- Password hashing (in production)

### Movie Booking Flow
- Movie browsing and selection
- Interactive seat selection
- Booking confirmation
- Add-on services integration

### Analytics Dashboard
- Real-time data visualization
- Sentiment analysis
- Sales predictions
- Keyword extraction

### Responsive Design
- Mobile-friendly interface
- Modern UI/UX
- Smooth animations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


