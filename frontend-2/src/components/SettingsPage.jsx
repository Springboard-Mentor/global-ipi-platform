import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, Lock, Key, Shield, CreditCard, Monitor, Moon, Sun, 
  Download, Database, Check, RefreshCw, AlertTriangle, Save,
  Eye, EyeOff
} from 'lucide-react';

// 🔴 Ensure this matches your running Backend IP
const API_BASE = "http://192.168.43.45:5001/api";

const SettingsPage = ({ user }) => {
    // Default to 'appearance' since Profile is removed
    const [activeTab, setActiveTab] = useState('appearance');
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);

    // --- STATE: Holds all settings ---
    const [settings, setSettings] = useState({
        // Appearance
        theme: 'light',
        compactMode: false,
        // Notifications
        emailNotifications: true,
        criticalAlerts: true,
        marketingEmails: false,
        pushNotifications: true,
        // Security
        twoFactorAuth: false,
        sessionTimeout: '30',
        loginAlerts: true,
        // Privacy
        publicProfile: true,
        dataSharing: false,
        // API
        geminiKey: ''
    });

    // --- 1. INITIAL LOAD: Fetch Settings from Backend ---
    useEffect(() => {
        const fetchSettings = async () => {
            if (!user?.id) return;

            try {
                console.log(`🔵 Fetching settings for User ID: ${user.id}...`);
                const res = await axios.get(`${API_BASE}/settings/${user.id}`);
                console.log("✅ Settings Fetched:", res.data);
                
                if (res.data) {
                    // Merge DB data with defaults
                    setSettings(prev => ({ ...prev, ...res.data }));
                }
            } catch (error) {
                console.error("❌ Failed to fetch settings (using defaults):", error);
            }
        };
        fetchSettings();
    }, [user]);

    // --- 2. DARK MODE LOGIC (The "Brute Force" Fix) ---
    useEffect(() => {
        const root = document.documentElement; // The <html> tag
        
        if (settings.theme === 'dark') {
            // 1. Tell Tailwind to go dark
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
            
            // 2. 🟢 FORCE the Background Color (Bypasses Tailwind Config)
            document.body.style.backgroundColor = '#0f172a'; // Dark Slate 900
            document.body.style.color = '#f8fafc';           // White text
            
        } else {
            // 1. Tell Tailwind to go light
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
            
            // 2. 🟢 FORCE the Background Color
            document.body.style.backgroundColor = '#f8fafc'; // Light Slate 50
            document.body.style.color = '#0f172a';           // Dark text
        }
    }, [settings.theme]);
    // --- 3. AUTO-CLEAR MESSAGES ---
    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => setSuccessMsg(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMsg]);

    // --- 4. HANDLERS ---

    // Save Immediately (For Toggles/Buttons)
    const handleSettingChange = async (key, value) => {
        // 1. Optimistic Update (Update UI instantly)
        setSettings(prev => ({ ...prev, [key]: value }));
        
        // 2. Background Save
        if (user?.id) {
            try {
                await axios.put(`${API_BASE}/settings/${user.id}`, { [key]: value });
                console.log(`✅ Auto-saved ${key}: ${value}`);
            } catch (error) {
                console.error(`❌ Background save failed for ${key}`, error);
            }
        }
    };

    // Save Manually (For Inputs like API Key)
    const handleGlobalSave = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            await axios.put(`${API_BASE}/settings/${user.id}`, settings);
            setSuccessMsg('Settings saved successfully!');
        } catch (error) {
            console.error("❌ Save Failed:", error);
            alert("Failed to save settings.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fake Action for Demo Buttons
    const simulateAction = (actionName) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSuccessMsg(`${actionName} completed successfully!`);
        }, 1500);
    };

    // --- COMPONENTS ---
    const TabButton = ({ id, icon: Icon, label, description }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all border text-left group ${
                activeTab === id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-sm dark:bg-indigo-900/20 dark:border-indigo-700' 
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700'
            }`}
        >
            <div className={`p-2 rounded-lg ${activeTab === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className={`font-semibold ${activeTab === id ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>{label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{description}</p>
            </div>
        </button>
    );

    const ToggleSwitch = ({ label, settingKey, description, icon: Icon }) => (
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-3">
                {Icon && <div className="p-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-300"><Icon size={18}/></div>}
                <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
                </div>
            </div>
            <button
                onClick={() => handleSettingChange(settingKey, !settings[settingKey])}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    settings[settingKey] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
            >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                    settings[settingKey] ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 pb-12 transition-colors duration-300">
            
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-6 mb-8 transition-colors duration-300">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage platform preferences and configurations.</p>
                    </div>
                    {/* Only show global save if on API or non-auto-save tabs if desired, but kept for clarity */}
                    <button 
                        onClick={handleGlobalSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl hover:opacity-90 transition shadow-lg disabled:opacity-70"
                    >
                        {isLoading ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18} />}
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 grid grid-cols-12 gap-8">
                
                {/* SIDEBAR NAVIGATION */}
                <div className="col-span-12 lg:col-span-3 space-y-2">
                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">General</p>
                    <TabButton id="appearance" icon={Monitor} label="Appearance" description="Theme & Display" />
                    <TabButton id="notifications" icon={Bell} label="Notifications" description="Email & Push alerts" />
                    <TabButton id="privacy" icon={Shield} label="Privacy & Data" description="Visibility settings" />
                    
                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6">System</p>
                    <TabButton id="security" icon={Lock} label="Security" description="2FA & Sessions" />
                    <TabButton id="api" icon={Key} label="API Keys" description="Gemini Integration" />
                    <TabButton id="billing" icon={CreditCard} label="Plan & Billing" description="Subscriptions" />
                    <TabButton id="data" icon={Database} label="Data Management" description="Export & Deletion" />
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="col-span-12 lg:col-span-9">
                    
                    {successMsg && (
                        <div className="fixed top-24 right-8 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-right z-50">
                            <Check size={20} />
                            <span className="font-medium">{successMsg}</span>
                        </div>
                    )}

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[600px] flex flex-col transition-colors duration-300">
                        
                        {/* --- 1. APPEARANCE TAB --- */}
                        {activeTab === 'appearance' && (
                            <div className="p-8 space-y-8 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Interface Theme</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {['light', 'dark', 'system'].map((themeOption) => (
                                        <button 
                                            key={themeOption}
                                            onClick={() => handleSettingChange('theme', themeOption)}
                                            className={`p-4 border-2 rounded-xl text-center transition-all ${
                                                settings.theme === themeOption 
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-500' 
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 dark:text-slate-300'
                                            }`}
                                        >
                                            <div className="mx-auto mb-2 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 rounded-full shadow-sm">
                                                {themeOption === 'light' && <Sun size={20} />}
                                                {themeOption === 'dark' && <Moon size={20} />}
                                                {themeOption === 'system' && <Monitor size={20} />}
                                            </div>
                                            <span className="capitalize font-bold text-sm">{themeOption} Mode</span>
                                        </button>
                                    ))}
                                </div>
                                <ToggleSwitch label="Compact Mode" settingKey="compactMode" description="Reduce whitespace for higher data density." />
                            </div>
                        )}

                        {/* --- 2. NOTIFICATIONS TAB --- */}
                        {activeTab === 'notifications' && (
                            <div className="p-8 space-y-8 animate-in fade-in">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Email Notifications</h3>
                                    <div className="grid gap-4 mt-4">
                                        <ToggleSwitch label="Essential Updates" settingKey="emailNotifications" description="Security alerts and account notifications." />
                                        <ToggleSwitch label="Marketing Emails" settingKey="marketingEmails" description="Feature announcements and product tips." />
                                    </div>
                                </div>
                                <hr className="border-slate-100 dark:border-slate-700" />
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Real-time Alerts</h3>
                                    <div className="grid gap-4 mt-4">
                                        <ToggleSwitch label="Critical Infringement Alerts" settingKey="criticalAlerts" icon={AlertTriangle} description="Instant SMS when high-risk IP infringement is detected." />
                                        <ToggleSwitch label="Push Notifications" settingKey="pushNotifications" description="Browser notifications for dashboard updates." />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- 3. PRIVACY TAB --- */}
                        {activeTab === 'privacy' && (
                            <div className="p-8 space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Privacy Controls</h3>
                                <ToggleSwitch label="Public Profile" settingKey="publicProfile" description="Allow other users on the platform to find your firm." />
                                <ToggleSwitch label="Data Sharing for AI Training" settingKey="dataSharing" description="Allow anonymized data to improve our patent models." />
                            </div>
                        )}

                        {/* --- 4. SECURITY TAB --- */}
                        {activeTab === 'security' && (
                            <div className="p-8 space-y-8 animate-in fade-in">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Authentication</h3>
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6 flex items-start gap-4">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-full text-indigo-600 shadow-sm"><Shield size={24}/></div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-indigo-900 dark:text-indigo-300">Two-Factor Authentication</h4>
                                            <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1 mb-4">Add an extra layer of security to your account.</p>
                                            <button 
                                                onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
                                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${settings.twoFactorAuth ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                            >
                                                {settings.twoFactorAuth ? 'Disable 2FA' : 'Enable 2FA'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Session Settings</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Auto-Logout Timer (Minutes)</label>
                                            <select 
                                                value={settings.sessionTimeout} 
                                                onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                            >
                                                <option value="15">15 Minutes</option>
                                                <option value="30">30 Minutes</option>
                                                <option value="60">1 Hour</option>
                                                <option value="never">Never (Not Recommended)</option>
                                            </select>
                                        </div>
                                        <ToggleSwitch label="Login Alerts" settingKey="loginAlerts" description="Notify me of new login attempts." />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- 5. API KEYS TAB --- */}
                        {activeTab === 'api' && (
                            <div className="p-8 space-y-8 animate-in fade-in">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Gemini AI Configuration</h3>
                                    <div className="bg-slate-900 rounded-xl p-6 relative overflow-hidden group mt-4">
                                        <div className="absolute top-0 right-0 p-32 bg-indigo-500 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secret Key</label>
                                        <div className="mt-2 flex gap-3">
                                            <div className="flex-1 bg-slate-800 rounded-lg flex items-center px-4 border border-slate-700">
                                                <Key size={16} className="text-indigo-400 mr-3" />
                                                <input 
                                                    type={showApiKey ? "text" : "password"} 
                                                    value={settings.geminiKey || ''}
                                                    onChange={(e) => setSettings(prev => ({...prev, geminiKey: e.target.value}))} // Just update state, don't save on every keystroke
                                                    className="bg-transparent border-none text-slate-200 w-full outline-none font-mono text-sm"
                                                    placeholder="sk-..."
                                                />
                                            </div>
                                            <button onClick={() => setShowApiKey(!showApiKey)} className="p-3 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-white transition">
                                                {showApiKey ? <EyeOff size={20}/> : <Eye size={20}/>}
                                            </button>
                                            <button onClick={handleGlobalSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition font-medium text-sm">Save Key</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- 6. BILLING TAB --- */}
                        {activeTab === 'billing' && (
                            <div className="p-8 space-y-6 animate-in fade-in">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Current Subscription</h3>
                                <div className="p-6 bg-slate-900 text-white rounded-2xl relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Plan</p>
                                                <h4 className="text-3xl font-black">{user?.planType || 'STARTUP'}</h4>
                                            </div>
                                            <span className="px-4 py-1.5 bg-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider">Active</span>
                                        </div>
                                        
                                        <div className="space-y-3 pt-6 border-t border-slate-700/50">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400 text-sm">Billing Cycle</span>
                                                <span className="font-bold">{user?.billingCycle || 'Monthly'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400 text-sm">Amount Paid</span>
                                                <span className="font-bold text-emerald-400">₹{user?.amountPaid || '0.00'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400 text-sm">Next Renewal</span>
                                                <span className="font-bold text-indigo-300">{user?.renewalDate || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
                                </div>
                            </div>
                        )}

                        {/* --- 7. DATA MANAGEMENT TAB --- */}
                        {activeTab === 'data' && (
                            <div className="p-8 space-y-8 animate-in fade-in">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Export & Backup</h3>
                                    <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-green-100 text-green-700 rounded-lg"><Database size={24}/></div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">Download Full Backup</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Includes all patent filings and settings.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => simulateAction("Backup Download")} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition font-medium text-sm flex items-center gap-2 dark:text-slate-200">
                                            <Download size={16} /> Download .SQL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;