import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import UserHome from './pages/UserHome';
import AdminHome from './pages/AdminHome';
import BendaharaHome from './pages/BendaharaHome';
import PublicCheckPayment from './pages/PublicCheckPayment';
import Layout from './components/Layout';
import { initializeData } from './utils/mockData.ts';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    // Initialize mock data when app starts
    initializeData();
    
    // Include Google Font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PublicCheckPayment />} />
          <Route path="login" element={<Login />} />
          
          <Route path="admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminHome />
            </ProtectedRoute>
          } />
          
          <Route path="user" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserHome />
            </ProtectedRoute>
          } />
          
          <Route path="bendahara" element={
            <ProtectedRoute allowedRoles={['bendahara']}>
              <BendaharaHome />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
