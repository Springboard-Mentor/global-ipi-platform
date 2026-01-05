import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Verification from './components/Verification';
import App from './App';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes - Login/Register */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verification" element={<Verification />} />
      
      {/* Protected Route - Dashboard */}
      <Route path="/dashboard/*" element={<App />} />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
