import React, { createContext, useState, useEffect, useContext } from 'react';

const AdminUIContext = createContext();

export const useAdminUI = () => useContext(AdminUIContext);

export const AdminUIProvider = ({ children }) => {
    const [uiSettings, setUiSettings] = useState({
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
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
            if (!adminToken) {
                setLoading(false);
                return;
            }

            const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";
            const res = await fetch(`${BASE_URL}/api/admin/ui/settings`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUiSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error("Failed to fetch UI settings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <AdminUIContext.Provider value={{ uiSettings, refreshSettings: fetchSettings, loading }}>
            {children}
        </AdminUIContext.Provider>
    );
};
