import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import { useAdminUI } from "../context/AdminUIContext";

const UIManagement = () => {
  const [activeTab, setActiveTab] = useState("themes");
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { refreshSettings } = useAdminUI();

  // State for all UI Settings
  const [settings, setSettings] = useState({
    activeThemeId: "dark",
    activeLayoutId: "sidebar",
    logoUrl: "",
    faviconUrl: "",
    fontFamily: "Inter",
    fontSize: "Medium",
    companyName: "Global IP Platform",
    footerText: "© 2024 Global IP Platform",
    welcomeMessage: "Welcome to your IP dashboard"
  });

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
        const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";
        
        const res = await fetch(`${BASE_URL}/api/admin/ui/settings`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Failed to load UI settings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";
      
      const res = await fetch(`${BASE_URL}/api/admin/ui/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        await refreshSettings();
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings.");
      }
    } catch (err) {
      console.error("Error saving settings", err);
      alert("Error saving settings.");
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";
      
      const res = await fetch(`${BASE_URL}/api/admin/ui/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });

      if (res.ok) {
        const url = await res.text();
        setSettings(prev => ({
          ...prev,
          [type === 'logo' ? 'logoUrl' : 'faviconUrl']: url
        }));
      }
    } catch (err) {
      console.error("File upload failed", err);
    }
  };

  const themes = [
    { id: "dark", name: "Dark Theme", primary: "#0d1117", secondary: "#161b22", accent: "#3b82f6" },
    { id: "light", name: "Light Theme", primary: "#ffffff", secondary: "#f3f4f6", accent: "#2563eb" },
    { id: "corporate", name: "Corporate Blue", primary: "#0f172a", secondary: "#1e293b", accent: "#1d4ed8" },
    { id: "nature", name: "Nature Green", primary: "#064e3b", secondary: "#022c22", accent: "#10b981" },
  ];

  const layouts = [
    { id: "sidebar", name: "Sidebar Navigation", description: "Left sidebar with collapsible menu" },
    { id: "topbar", name: "Top Navigation", description: "Top horizontal navigation bar" },
    { id: "hybrid", name: "Hybrid Layout", description: "Sidebar + Topbar combined" },
  ];

  // Map state to components list for rendering
  const componentConfig = [
    { key: "companyName", name: "Company Name", type: "text" },
    { key: "footerText", name: "Footer Text", type: "text" },
    { key: "welcomeMessage", name: "Welcome Message", type: "text" },
    // Header Logo handled in Branding
  ];

  if (loading) {
    return <AdminLayout><div className="p-6 text-white">Loading settings...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">UI Management</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-lg text-white ${previewMode
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {previewMode ? "Exit Preview" : "Preview Changes"}
            </button>
            <button
              onClick={saveSettings}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#30363d]">
          {["themes", "layout", "branding", "components"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize ${activeTab === tab
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* THEMES */}
        {activeTab === "themes" && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Theme Selection
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {themes.map((theme) => {
                const isActive = settings.activeThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setSettings({ ...settings, activeThemeId: theme.id })}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${isActive
                      ? "border-blue-500 bg-[#0d1117]"
                      : "border-[#30363d] hover:border-gray-500"
                      }`}
                  >
                    <div className="flex justify-between mb-3">
                      <p className="text-white font-medium">{theme.name}</p>
                      {isActive && (
                        <span className="text-blue-400 text-xs">Active</span>
                      )}
                    </div>

                    <div className="flex gap-2 mb-3">
                      <div className="w-6 h-6 rounded" style={{ background: theme.primary }} />
                      <div className="w-6 h-6 rounded" style={{ background: theme.secondary }} />
                      <div className="w-6 h-6 rounded" style={{ background: theme.accent }} />
                    </div>

                    <div className="h-12 bg-[#0d1117] border border-[#30363d] rounded" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LAYOUT */}
        {activeTab === "layout" && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Layout Options</h2>

            {layouts.map((layout) => {
              const isActive = settings.activeLayoutId === layout.id;
              return (
                <div
                  key={layout.id}
                  onClick={() => setSettings({ ...settings, activeLayoutId: layout.id })}
                  className={`border rounded-lg p-4 flex justify-between cursor-pointer ${isActive
                    ? "border-blue-500 bg-[#0d1117]"
                    : "border-[#30363d] hover:border-gray-500"
                    }`}
                >
                  <div>
                    <p className="text-white font-medium">{layout.name}</p>
                    <p className="text-gray-400 text-sm">
                      {layout.description}
                    </p>
                  </div>
                  {isActive && (
                    <span className="text-blue-400 text-sm">Active</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* BRANDING */}
        {activeTab === "branding" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Brand Assets
              </h2>

              <div className="space-y-4">
                {/* Logo Upload */}
                <div className="border border-dashed border-[#30363d] rounded-lg p-6 text-center">
                  <p className="text-gray-400 mb-2">Logo Upload</p>
                  {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-12 mx-auto mb-2" />}
                  <label className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm cursor-pointer inline-block">
                    Choose File
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'logo')} />
                  </label>
                </div>

                {/* Favicon Upload */}
                <div className="border border-dashed border-[#30363d] rounded-lg p-6 text-center">
                  <p className="text-gray-400 mb-2">Favicon Upload</p>
                  {settings.faviconUrl && <img src={settings.faviconUrl} alt="Favicon" className="h-8 mx-auto mb-2" />}
                  <label className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm cursor-pointer inline-block">
                    Choose File
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'favicon')} />
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Typography
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Font Family</label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-white"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-1">Base Font Size</label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-white"
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPONENTS */}
        {activeTab === "components" && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Customizable Components
            </h2>

            {componentConfig.map((c, i) => (
              <div
                key={c.key}
                className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex gap-4 items-center"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{c.name}</p>
                  <p className="text-gray-400 text-sm">{c.type}</p>
                </div>

                <input
                  className="flex-1 bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-white"
                  value={settings[c.key] || ''}
                  onChange={(e) => setSettings({ ...settings, [c.key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        )}

        {/* PREVIEW */}
        {previewMode && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 w-full max-w-4xl">
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Live UI Preview
                </h3>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Dynamic Preview Area */}
              <div
                className="h-96 border border-[#30363d] rounded flex flex-col items-center justify-center text-gray-400 transition-colors duration-300"
                style={{
                  backgroundColor: themes.find(t => t.id === settings.activeThemeId)?.primary || '#0d1117',
                  fontFamily: settings.fontFamily
                }}
              >
                <div className="p-4 text-center">
                  {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-10 mx-auto mb-4" />}
                  <h1 className="text-2xl font-bold mb-2 text-white">{settings.companyName}</h1>
                  <p className="mb-4">{settings.welcomeMessage}</p>
                  <p className="text-xs opacity-50">{settings.footerText}</p>
                  <div className="mt-4 text-sm">
                    Active Layout: {layouts.find(l => l.id === settings.activeLayoutId)?.name}<br />
                    Theme: {themes.find(t => t.id === settings.activeThemeId)?.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default UIManagement;
