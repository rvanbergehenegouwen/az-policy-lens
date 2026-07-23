import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu, LogOut, User, Settings } from 'lucide-react';
import { useState } from 'react';
export const Header = ({ userEmail, onLogout, onToggleSidebar }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const version = '1.0.0';
    return (_jsxs("header", { style: {
            background: 'white',
            borderBottom: '1px solid var(--border-color)',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [_jsx("button", { onClick: onToggleSidebar, style: {
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                        }, children: _jsx(Menu, { size: 24, color: "#c41e3a" }) }), _jsxs("h1", { style: { margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }, children: ["Azure Policy Lens", _jsxs("span", { className: "app-version", children: ["v", version] })] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }, children: [_jsxs("div", { onClick: () => setShowUserMenu(!showUserMenu), style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-light)',
                        }, children: [_jsx(User, { size: 18 }), _jsx("span", { style: { fontSize: '0.875rem' }, children: userEmail || 'Guest' })] }), showUserMenu && (_jsxs("div", { style: {
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            background: 'white',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            zIndex: 1000,
                            minWidth: '200px',
                        }, children: [_jsxs("a", { href: "#/settings", style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderBottom: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                }, children: [_jsx(Settings, { size: 16 }), "Settings"] }), _jsxs("button", { onClick: () => {
                                    onLogout?.();
                                    setShowUserMenu(false);
                                }, style: {
                                    width: '100%',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--bam-red)',
                                }, children: [_jsx(LogOut, { size: 16 }), "Logout"] })] }))] })] }));
};
