import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard.jsx';
import Profile from './components/Profile';
import IPActivity from './components/IPActivity.js';

function App() {
  return (
      <div className="App">
        <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ipActivity" element={<IPActivity />} />
        </Routes>
      </div>
  );
}

export default App;