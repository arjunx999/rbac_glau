import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './layout/DashboardLayout';
import Login from './pages/Auth/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';
import MyMarks from './pages/Student/MyMarks';
import StudentProfile from './pages/Student/StudentProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes - Admin */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/students" element={<AdminDashboard />} />
                    <Route path="/faculty" element={<AdminDashboard />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Faculty */}
          <Route 
            path="/faculty/*" 
            element={
              <ProtectedRoute allowedRoles={['FACULTY']}>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<FacultyDashboard />} />
                    <Route path="/subjects" element={<FacultyDashboard />} />
                    <Route path="/marks" element={<FacultyDashboard />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Student */}
          <Route 
            path="/student/*" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<StudentDashboard />} />
                    <Route path="/marks" element={<MyMarks />} />
                    <Route path="/profile" element={<StudentProfile />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
