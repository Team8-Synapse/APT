/**
 * Mobile: Frontend / Core
 * Description: Main Application Component. Defined specific routes for students and admins,
 * and manages route protection using PrivateRoute.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import AlumniInsights from './pages/student/AlumniInsights';
import PrepHub from './pages/student/PrepHub';
import StudentProfile from './pages/student/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPrepHub from './pages/admin/AdminPrepHub';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import PlacementDrives from './pages/student/PlacementDrives';
import MyApplications from './pages/student/MyApplications';
import InterviewExperiences from './pages/student/InterviewExperiences';
import CalendarPage from './pages/CalendarPage';
import NotificationsPage from './pages/NotificationsPage';
import Home from './pages/Home';



// Protected Route Component: Handles access control based on authentication and roles
const PrivateRoute = ({ children, role, hideNavbar = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div></div>;

  // Redirect to login if not authenticated
  if (!user) return <Navigate to="/login" />;

  // Redirect to home if user doesn't have required role
  if (role && user.role !== role) return <Navigate to="/" />;

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? "w-full" : "max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
        {children}
      </div>
    </>
  );
};


// Helper component to redirect authenticated users based on their role
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
          <Route path="/alumni-insights" element={<PrivateRoute role="student"><AlumniInsights /></PrivateRoute>} />
          <Route path="/prephub" element={<PrivateRoute role="student"><PrepHub /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute role="student"><StudentProfile /></PrivateRoute>} />
          <Route path="/drives" element={<PrivateRoute role="student"><PlacementDrives /></PrivateRoute>} />
          <Route path="/applications" element={<PrivateRoute role="student"><MyApplications /></PrivateRoute>} />
          <Route path="/experiences" element={<PrivateRoute role="student"><InterviewExperiences /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute role="admin" hideNavbar={true}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/prephub" element={<PrivateRoute role="admin" hideNavbar={true}><AdminPrepHub /></PrivateRoute>} />
          <Route path="/admin/announcements" element={<PrivateRoute role="admin" hideNavbar={true}><AdminAnnouncements /></PrivateRoute>} />
          <Route path="/home" element={<HomeRedirect />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
