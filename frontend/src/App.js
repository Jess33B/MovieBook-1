import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Page Components
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import SimpleLogin from './components/SimpleLogin';
import SimpleRegister from './components/SimpleRegister';
import FixedAdminLogin from './components/FixedAdminLogin';
import WorkingAdminLogin from './components/WorkingAdminLogin';
import EnhancedDashboard from './components/EnhancedDashboard';
import MovieList from './components/MovieList';
import Booking from './components/Booking';
import Analytics from './components/Analytics';
import Profile from './components/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MovieList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<WorkingAdminLogin />} />
            <Route path="/simple-admin-login" element={<FixedAdminLogin />} />
            <Route path="/working-admin-login" element={<WorkingAdminLogin />} />
            <Route path="/simple-login" element={<SimpleLogin />} />
            <Route path="/simple-register" element={<SimpleRegister />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/booking/:movieId" element={<Booking />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <EnhancedDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Route */}
            <Route path="/" element={<MovieList />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
