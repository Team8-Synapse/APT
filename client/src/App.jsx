import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AlumniInsights from './pages/AlumniInsights';
import PrepHub from './pages/PrepHub';
import StudentProfile from './pages/StudentProfile';
import AdminDashboard from './pages/AdminDashboard';
import PlacementDrives from './pages/PlacementDrives';
import MyApplications from './pages/MyApplications';
import InterviewExperiences from './pages/InterviewExperiences';
import CalendarPage from './pages/CalendarPage';
import NotificationsPage from './pages/NotificationsPage';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </>
  );
};

import Home from './pages/Home';

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div></div>;
  if (!user) return <Navigate to="/login" />;
  return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
          <Route path="/alumni" element={<PrivateRoute role="student"><AlumniInsights /></PrivateRoute>} />
          <Route path="/prephub" element={<PrivateRoute role="student"><PrepHub /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute role="student"><StudentProfile /></PrivateRoute>} />
          <Route path="/drives" element={<PrivateRoute role="student"><PlacementDrives /></PrivateRoute>} />
          <Route path="/applications" element={<PrivateRoute role="student"><MyApplications /></PrivateRoute>} />
          <Route path="/experiences" element={<PrivateRoute role="student"><InterviewExperiences /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/home" element={<HomeRedirect />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
