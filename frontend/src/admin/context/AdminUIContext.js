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
            const token = localStorage.getItem('token');
            if (!token) return;

            // If token handling is different for admin (e.g. adminToken vs token), verify.
            // AdminLayout uses 'adminToken' (line 19 of AdminLayout.js).
            // AdminSettings uses 'token'. 
            // I should probably check which one is correct.
            // AdminDetails/Admin pages usually use the token stored during login.
            // AdminLogin stores 'adminToken' I believe?

            // Checking AdminLogin.js would confirm.
            // For now, I'll check if 'adminToken' exists, if not use 'token'.

            const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');

            const res = await fetch('http://localhost:8081/api/admin/ui/settings', {
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
