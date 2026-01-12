import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile";
import IPActivity from "./components/IPActivity.js";
import FilingTrackerDashboard from "./components/FilingTrackerDashboard.js";
import FilingList from "./components/FilingList.js";
import FilingDetail from "./components/FilingDetail.js";
import ProtectedFilingTracker from "./components/ProtectedFilingTracker.js";
import PricingPage from "./components/PricingPage.js";
import CheckoutPage from "./components/CheckoutPage.js";
import SubscriptionStatus from "./components/SubscriptionStatus.js";
import HelpCenter from "./components/landingPageComponents/HelpCenter";
import PrivacyPolicy from "./components/landingPageComponents/PrivacyPolicy.js";
import TermsOfService from "./components/landingPageComponents/TermsOfService.js";
import Settings from "./components/dashboardComponents/Settings";
import Feedback from "./components/landingPageComponents/Feedback";
import IPSearch from "./components/IPSearch";
import SearchResults from "./components/dashboardComponents/ipSearchComponents/SearchResults.js";
import IPDetails from "./components/dashboardComponents/ipSearchComponents/IPDetails.jsx";
import LegalStatusDashboard from "./components/LegalStatusDashboard.jsx";
import PatentFiling from "./components/PatentFiling";

function App() {
  return (
    <SubscriptionProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ipActivity" element={<IPActivity />} />
          
          <Route path="/filing-tracker-dashboard" element={<ProtectedFilingTracker><FilingTrackerDashboard /></ProtectedFilingTracker>} />
          <Route path="/filing-list" element={<ProtectedFilingTracker><FilingList /></ProtectedFilingTracker>} />
          <Route path="/filing-detail/:id" element={<ProtectedFilingTracker><FilingDetail /></ProtectedFilingTracker>} />
          
          {/* --- CHANGE MADE HERE: Removed <ProtectedFilingTracker> --- */}
          <Route path="/patent-filing" element={<PatentFiling />} />

          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/checkout/:planKey" element={<CheckoutPage />} />
          <Route path="/subscription-status" element={<SubscriptionStatus />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/ip-search" element={<IPSearch />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/ip/:id" element={<IPDetails />} />
          <Route path="/legal-status" element={<LegalStatusDashboard/>} />

        </Routes>
      </div>
    </SubscriptionProvider>
  );
}

export default App;