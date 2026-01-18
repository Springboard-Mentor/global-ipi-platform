import React, { useState } from "react";
import AdminLayout from "../layout/AdminLayout";

const UIManagement = () => {
  const [activeTab, setActiveTab] = useState("themes");
  const [previewMode, setPreviewMode] = useState(false);

  const themes = [
    { id: "dark", name: "Dark Theme", primary: "#0d1117", secondary: "#161b22", accent: "#3b82f6", active: true },
    { id: "light", name: "Light Theme", primary: "#ffffff", secondary: "#f3f4f6", accent: "#2563eb", active: false },
    { id: "corporate", name: "Corporate Blue", primary: "#0f172a", secondary: "#1e293b", accent: "#1d4ed8", active: false },
    { id: "nature", name: "Nature Green", primary: "#064e3b", secondary: "#022c22", accent: "#10b981", active: false },
  ];

  const layouts = [
    { id: "sidebar", name: "Sidebar Navigation", description: "Left sidebar with collapsible menu", active: true },
    { id: "topbar", name: "Top Navigation", description: "Top horizontal navigation bar", active: false },
    { id: "hybrid", name: "Hybrid Layout", description: "Sidebar + Topbar combined", active: false },
  ];

  const components = [
    { name: "Header Logo", type: "image", value: "logo.png" },
    { name: "Company Name", type: "text", value: "Global IP Platform" },
    { name: "Footer Text", type: "text", value: "© 2024 Global IP Platform" },
    { name: "Welcome Message", type: "text", value: "Welcome to your IP dashboard" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">UI Management</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-lg text-white ${
                previewMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {previewMode ? "Exit Preview" : "Preview Changes"}
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white">
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
              className={`pb-3 capitalize ${
                activeTab === tab
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
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    theme.active
                      ? "border-blue-500 bg-[#0d1117]"
                      : "border-[#30363d] hover:border-gray-500"
                  }`}
                >
                  <div className="flex justify-between mb-3">
                    <p className="text-white font-medium">{theme.name}</p>
                    {theme.active && (
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
              ))}
            </div>
          </div>
        )}

        {/* LAYOUT */}
        {activeTab === "layout" && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Layout Options</h2>

            {layouts.map((layout) => (
              <div
                key={layout.id}
                className={`border rounded-lg p-4 flex justify-between ${
                  layout.active
                    ? "border-blue-500 bg-[#0d1117]"
                    : "border-[#30363d]"
                }`}
              >
                <div>
                  <p className="text-white font-medium">{layout.name}</p>
                  <p className="text-gray-400 text-sm">
                    {layout.description}
                  </p>
                </div>
                {layout.active && (
                  <span className="text-blue-400 text-sm">Active</span>
                )}
              </div>
            ))}
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
                {["Logo", "Favicon"].map((item) => (
                  <div
                    key={item}
                    className="border border-dashed border-[#30363d] rounded-lg p-6 text-center"
                  >
                    <p className="text-gray-400 mb-2">{item} Upload</p>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm">
                      Choose File
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Typography
              </h2>

              <div className="space-y-4">
                <select className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-white">
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                  <option>Lato</option>
                </select>

                <select className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-white">
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
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

            {components.map((c, i) => (
              <div
                key={i}
                className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex gap-4 items-center"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{c.name}</p>
                  <p className="text-gray-400 text-sm">{c.type}</p>
                </div>

                <input
                  className="flex-1 bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-white"
                  defaultValue={c.value}
                />

                <button className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white text-sm">
                  Save
                </button>
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

              <div className="h-96 bg-[#0d1117] border border-[#30363d] rounded flex items-center justify-center text-gray-400">
                UI Preview Area
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default UIManagement;
