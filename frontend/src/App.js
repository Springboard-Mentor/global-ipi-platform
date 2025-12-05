import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MobileHome from './pages/MobileHome';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mobile-home" element={<MobileHome />} />
        {/* Add more routes here if needed */}
        {/* <Route path="/search" element={<SearchResults />} /> */}
        {/* <Route path="/filing-tracker" element={<FilingTracker />} /> */}
        {/* <Route path="/legal-status" element={<LegalStatus />} /> */}
        {/* <Route path="/settings" element={<Settings />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
