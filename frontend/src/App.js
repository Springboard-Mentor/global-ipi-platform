import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { AdminUIProvider } from "./admin/context/AdminUIContext";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile";
import IPActivity from "./components/IPActivity.js";
import FilingTrackerDashboard from "./components/FilingTrackerDashboard.js";
import FilingList from "./components/FilingList.js";
import FilingDetail from "./components/FilingDetail.js";
import MyFilings from "./components/MyFilings";
import MyFilingDetail from "./components/MyFilingDetail";
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
import PatentFilingWizard from "./components/PatentFilingWizard";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminFilingDetail from "./admin/pages/AdminFilingDetail";
import AdminUserManagement from "./admin/pages/AdminUserManagement";
import AdminFilingsManagement from "./admin/pages/AdminFilingsManagement";
import AdminMonitoring from "./admin/pages/AdminMonitoring";
import AdminFinanceManagement from "./admin/pages/AdminFinanceManagement";
import AdminSettings from "./admin/pages/AdminSettings";

function App() {
  return (
    <SubscriptionProvider>
      <AdminUIProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/filings" element={<AdminFilingsManagement />} />
            <Route path="/admin/filings/:id" element={<AdminFilingDetail />} />
            <Route path="/admin/monitoring" element={<AdminMonitoring />} />
            <Route path="/admin/finance" element={<AdminFinanceManagement />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ipActivity" element={<IPActivity />} />

            <Route path="/filing-tracker-dashboard" element={<ProtectedFilingTracker><FilingTrackerDashboard /></ProtectedFilingTracker>} />
            <Route path="/filing-list" element={<ProtectedFilingTracker><FilingList /></ProtectedFilingTracker>} />
            <Route path="/filing-detail/:id" element={<ProtectedFilingTracker><FilingDetail /></ProtectedFilingTracker>} />

            {/* Patent filing routes (legacy and new wizard) */}
            <Route path="/patent-filing" element={<PatentFiling />} />
            <Route path="/file-patent" element={<PatentFilingWizard />} />
            <Route path="/my-filings" element={<MyFilings />} />
            <Route path="/my-filings/:id" element={<MyFilingDetail />} />

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
            <Route path="/legal-status" element={<LegalStatusDashboard />} />

          </Routes>
        </div>
      </AdminUIProvider>
    </SubscriptionProvider>
  );
}

export default App;