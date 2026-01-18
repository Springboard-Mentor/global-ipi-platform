import React, { useState } from 'react';

const UIManagement = () => {
  const [activeTab, setActiveTab] = useState('themes');
  const [previewMode, setPreviewMode] = useState(false);

  const themes = [
    { id: 'dark', name: 'Dark Theme', primary: '#3B82F6', secondary: '#1E293B', accent: '#8B5CF6', active: true },
    { id: 'light', name: 'Light Theme', primary: '#2563EB', secondary: '#F8FAFC', accent: '#7C3AED', active: false },
    { id: 'corporate', name: 'Corporate Blue', primary: '#1D4ED8', secondary: '#0F172A', accent: '#06B6D4', active: false },
    { id: 'nature', name: 'Nature Green', primary: '#059669', secondary: '#064E3B', accent: '#10B981', active: false }
  ];

  const layoutOptions = [
    { id: 'sidebar', name: 'Sidebar Navigation', description: 'Traditional sidebar with collapsible menu', active: true },
    { id: 'topbar', name: 'Top Navigation', description: 'Horizontal navigation bar at the top', active: false },
    { id: 'hybrid', name: 'Hybrid Layout', description: 'Combination of top and side navigation', active: false }
  ];

  const customizableComponents = [
    { name: 'Header Logo', type: 'image', current: 'logo.png', editable: true },
    { name: 'Company Name', type: 'text', current: 'Global IP Platform', editable: true },
    { name: 'Footer Text', type: 'text', current: '© 2024 Global IP Platform', editable: true },
    { name: 'Welcome Message', type: 'text', current: 'Welcome to your IP dashboard', editable: true },
    { name: 'Search Placeholder', type: 'text', current: 'Search patents, trademarks...', editable: true }
  ];

  const brandingSettings = {
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#10B981',
    fontFamily: 'Inter',
    logoUrl: '/assets/logo.png',
    faviconUrl: '/assets/favicon.ico'
  };

  const handleThemeChange = (themeId) => {
    console.log(`Switching to theme: ${themeId}`);
  };

  const handleLayoutChange = (layoutId) => {
    console.log(`Switching to layout: ${layoutId}`);
  };

  const handleComponentUpdate = (componentName, newValue) => {
    console.log(`Updating ${componentName} to: ${newValue}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">UI Management</h1>
        <div className="flex gap-3">
          <button onClick={() => setPreviewMode(!previewMode)} className={`px-4 py-2 rounded-lg transition ${previewMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
            {previewMode ? 'Exit Preview' : 'Preview Changes'}
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white transition">
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/20">
        {['themes', 'layout', 'branding', 'components'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 capitalize transition ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'themes' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Theme Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {themes.map((theme) => (
                <div key={theme.id} className={`border-2 rounded-lg p-4 cursor-pointer transition ${theme.active ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-white/40'}`} onClick={() => handleThemeChange(theme.id)}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{theme.name}</h4>
                    {theme.active && <span className="text-blue-400 text-sm">Active</span>}
                  </div>
                  <div className="flex gap-2 mb-3">
                    <div className="w-6 h-6 rounded" style={{backgroundColor: theme.primary}}></div>
                    <div className="w-6 h-6 rounded" style={{backgroundColor: theme.secondary}}></div>
                    <div className="w-6 h-6 rounded" style={{backgroundColor: theme.accent}}></div>
                  </div>
                  <div className="bg-black/20 rounded p-2 text-xs text-gray-300">
                    <div className="flex justify-between items-center mb-1">
                      <span>Header</span>
                      <span>Menu</span>
                    </div>
                    <div className="h-8 bg-white/10 rounded mb-1"></div>
                    <div className="h-4 bg-white/5 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Custom Theme Builder</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Primary Color</label>
                <div className="flex gap-2">
                  <input type="color" value={brandingSettings.primaryColor} className="w-12 h-10 rounded border border-white/20" />
                  <input type="text" value={brandingSettings.primaryColor} className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Secondary Color</label>
                <div className="flex gap-2">
                  <input type="color" value={brandingSettings.secondaryColor} className="w-12 h-10 rounded border border-white/20" />
                  <input type="text" value={brandingSettings.secondaryColor} className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Accent Color</label>
                <div className="flex gap-2">
                  <input type="color" value={brandingSettings.accentColor} className="w-12 h-10 rounded border border-white/20" />
                  <input type="text" value={brandingSettings.accentColor} className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Layout Options</h3>
          <div className="space-y-4">
            {layoutOptions.map((layout) => (
              <div key={layout.id} className={`border-2 rounded-lg p-4 cursor-pointer transition ${layout.active ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-white/40'}`} onClick={() => handleLayoutChange(layout.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{layout.name}</h4>
                    <p className="text-gray-400 text-sm">{layout.description}</p>
                  </div>
                  {layout.active && <span className="text-blue-400 text-sm">Active</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'branding' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Brand Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Logo Upload</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-gray-400 mb-2">Drop logo here or click to upload</p>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm transition">Choose File</button>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Favicon Upload</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">⭐</div>
                  <p className="text-gray-400 mb-2">Drop favicon here or click to upload</p>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm transition">Choose File</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Typography</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Font Family</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Font Size Scale</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'components' && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Customizable Components</h3>
          <div className="space-y-4">
            {customizableComponents.map((component, index) => (
              <div key={index} className="bg-black/20 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{component.name}</h4>
                    <p className="text-gray-400 text-sm">Type: {component.type}</p>
                  </div>
                  <div className="flex-1 mx-4">
                    {component.type === 'text' ? (
                      <input type="text" value={component.current} onChange={(e) => handleComponentUpdate(component.name, e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                    ) : (
                      <div className="flex gap-2">
                        <input type="text" value={component.current} className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white text-sm transition">Upload</button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm transition">Save</button>
                    <button className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-white text-sm transition">Reset</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Panel */}
      {previewMode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-white/20 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">UI Preview</h3>
              <button onClick={() => setPreviewMode(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="bg-black/20 rounded-lg p-4 h-96 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">👁️</div>
                <p>Live Preview</p>
                <p className="text-sm">Changes will be reflected here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIManagement;