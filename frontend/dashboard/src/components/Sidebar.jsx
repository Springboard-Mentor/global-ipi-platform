import React, { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Search,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Crown,
  Sparkles,
  MessageSquare,
  Mail,
} from "lucide-react";
import UpgradeModal from "./UpgradeModal";

const Sidebar = ({ isOpen, onClose, activeItem, setActiveItem, onLogout, userProfile }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "search", icon: Search, label: "Search" },
    { id: "filing", icon: FileText, label: "Filing Tracker" },
    { id: "legal", icon: BarChart3, label: "Legal Status" },
  ];

  const bottomItems = [
    { id: "contact", icon: Mail, label: "Contact Us" },
    { id: "feedback", icon: MessageSquare, label: "Feedback" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "logout", icon: LogOut, label: "Log Out" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 bg-white/95 backdrop-blur-md
          border-r border-white/20 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50"
          >
            {isOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${
                    activeItem === item.id
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50"
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* Upgrade to Pro Button */}
          {userProfile?.subscriptionType !== "pro" && userProfile?.subscriptionType !== "enterprise" && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-105 mt-4 relative overflow-hidden group"
            >
              <Crown size={20} className="animate-pulse" />
              <span className="font-bold">Upgrade to Pro</span>
              <Sparkles size={16} className="ml-auto" />
              <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </button>
          )}
        </nav>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() =>
                  item.id === "logout"
                    ? onLogout()
                    : setActiveItem(item.id)
                }
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${
                    activeItem === item.id
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50"
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        userProfile={userProfile}
      />
    </>
  );
};

export default Sidebar;
