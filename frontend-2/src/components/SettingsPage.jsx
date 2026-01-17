import React, { useState } from 'react';
import { Bell, Lock, Server, Check, X, Users, Database, Key } from 'lucide-react';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('notifications');
    const [settings, setSettings] = useState({
        emailNotifications: true,
        criticalAlerts: true,
        twoFactorAuth: false,
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const TabButton = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors w-full ${
                activeTab === id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'
            }`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );

    const ToggleSwitch = ({ label, settingKey, description }) => (
        <div className="flex items-center justify-between py-4 border-b">
            <div>
                <p className="text-sm font-medium text-slate-900">{label}</p>
                <p className="text-xs text-slate-500 mt-1">{description}</p>
            </div>
            <button
                onClick={() => handleToggle(settingKey)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings[settingKey] ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
            >
                <span className="sr-only">Toggle {label}</span>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[settingKey] ? 'translate-x-6' : 'translate-x-1'
                }`}></span>
            </button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">System Settings</h2>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex">
                
                {/* Sidebar Navigation */}
                <div className="w-64 border-r p-4 space-y-1 bg-slate-50">
                    <TabButton id="notifications" icon={Bell} label="Notifications" />
                    <TabButton id="security" icon={Lock} label="Security" />
                    <TabButton id="access" icon={Users} label="User Access" />
                    <TabButton id="api" icon={Key} label="API Keys" />
                    <TabButton id="data" icon={Database} label="Data Management" />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-8">
                    
                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-slate-800">Notification Preferences</h3>
                            <ToggleSwitch 
                                label="Email Notifications" 
                                settingKey="emailNotifications" 
                                description="Receive immediate updates on new filings and deadlines." 
                            />
                            <ToggleSwitch 
                                label="Critical Alerts" 
                                settingKey="criticalAlerts" 
                                description="Receive instant SMS notifications for infringement detection." 
                            />
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-slate-800">Security & Authentication</h3>
                            <div className="py-4 border-b">
                                <p className="text-sm font-medium text-slate-900">Two-Factor Authentication (2FA)</p>
                                <p className="text-xs text-slate-500 mt-1">Status: {settings.twoFactorAuth ? <span className="text-green-600">Active</span> : <span className="text-red-600">Inactive</span>}</p>
                                <button onClick={() => handleToggle('twoFactorAuth')} className="mt-3 px-4 py-2 text-sm rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition">
                                    {settings.twoFactorAuth ? 'Disable 2FA' : 'Enable 2FA'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* User Access Tab */}
                    {activeTab === 'access' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-slate-800">User Access Management</h3>
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                <p className="text-sm font-medium text-indigo-700">Current Users (Admin View)</p>
                                <ul className="mt-2 text-sm space-y-1">
                                    <li className="flex justify-between"><span>B. Admin (You)</span><span className="text-xs bg-green-100 text-green-700 px-2 rounded-full">Active</span></li>
                                    <li className="flex justify-between"><span>S. Partner</span><span className="text-xs bg-yellow-100 text-yellow-700 px-2 rounded-full">Pending Invite</span></li>
                                </ul>
                                <button className="mt-4 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">Invite New User</button>
                            </div>
                        </div>
                    )}
                    
                    {/* API Key Management Tab */}
                    {activeTab === 'api' && (
                        <div className="space-y-6">
                             <h3 className="text-2xl font-semibold text-slate-800">API Key Management</h3>
                             <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                                 <p className="text-sm font-medium text-slate-700">Gemini AI Service Key</p>
                                 <p className="text-xs text-red-500">Key Status: Requires refresh or input.</p>
                                 <input type="password" placeholder="•••••••••••••••" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm" disabled />
                                 <button className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition">Update API Key</button>
                             </div>
                        </div>
                    )}

                    {/* Data Management Tab */}
                    {activeTab === 'data' && (
                        <div className="space-y-6">
                             <h3 className="text-2xl font-semibold text-slate-800">Data & Backup</h3>
                             <div className="py-4 border-b">
                                 <p className="text-sm font-medium text-slate-900">Database Backup</p>
                                 <p className="text-xs text-slate-500 mt-1">Download a full snapshot of your patent data and user records.</p>
                                 <button className="mt-3 px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition">Initiate Backup (.SQL)</button>
                             </div>
                             <div className="py-4 border-b">
                                 <p className="text-sm font-medium text-slate-900">Purge Inactive Records</p>
                                 <p className="text-xs text-red-500 mt-1">Permanently delete rejected filings older than 5 years.</p>
                                 <button className="mt-3 px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition">Run Purge Tool</button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;