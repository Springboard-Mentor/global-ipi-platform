import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile";
import IPActivity from "./components/IPActivity.js";
import HelpCenter from "./components/landingPageComponents/HelpCenter";
import PrivacyPolicy from "./components/landingPageComponents/PrivacyPolicy.js";
import TermsOfService from "./components/landingPageComponents/TermsOfService.js";
import Settings from "./components/dashboardComponents/Settings";
import Feedback from "./components/landingPageComponents/Feedback";
import IPSearch from "./components/IPSearch";
import SearchResults from "./components/dashboardComponents/ipSearchComponents/SearchResults.js";
import IPDetails from "./components/dashboardComponents/ipSearchComponents/IPDetails.jsx";

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
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/ip-search" element={<IPSearch />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/ip/:id" element={<IPDetails />} />
      </Routes>
    </div>
  );
}

export default App;
