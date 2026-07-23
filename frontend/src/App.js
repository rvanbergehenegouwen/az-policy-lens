import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAppStore } from './store';
import { apiClient } from './api';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { UsersPage } from './pages/UsersPage';
import { ImportPage } from './pages/ImportPage';
import { BarChart3, Settings, Users, Upload, Home } from 'lucide-react';
function App() {
    const { currentUser, setCurrentUser } = useAppStore();
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.getCurrentUser();
                setCurrentUser(response.data);
                const email = response.data.email;
                localStorage.setItem('userEmail', email);
            }
            catch (error) {
                // User not authenticated - initialize as guest
                console.log('Guest mode');
            }
        };
        fetchUser();
    }, [setCurrentUser]);
    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('userEmail');
    };
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return _jsx(DashboardPage, {});
            case 'policies':
                return _jsx(PoliciesPage, {});
            case 'users':
                return currentUser?.role === 'admin' ? _jsx(UsersPage, {}) : _jsx("div", { style: { padding: '20px' }, children: "Access denied" });
            case 'import':
                return _jsx(ImportPage, {});
            case 'settings':
                return _jsxs("div", { style: { padding: '20px' }, children: [_jsx("h2", { children: "Settings" }), _jsx("p", { children: "Coming soon..." })] });
            default:
                return _jsx(DashboardPage, {});
        }
    };
    const navItems = [
        { label: 'Dashboard', href: '#', page: 'dashboard', icon: _jsx(Home, { size: 18 }) },
        { label: 'Policies', href: '#', page: 'policies', icon: _jsx(BarChart3, { size: 18 }) },
        { label: 'Import', href: '#', page: 'import', icon: _jsx(Upload, { size: 18 }) },
        ...(currentUser?.role === 'admin'
            ? [{ label: 'Users', href: '#', page: 'users', icon: _jsx(Users, { size: 18 }) }]
            : []),
        { label: 'Settings', href: '#', page: 'settings', icon: _jsx(Settings, { size: 18 }) },
    ];
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', minHeight: '100vh' }, children: [_jsx(Header, { userEmail: currentUser?.email, onLogout: handleLogout, onToggleSidebar: () => setSidebarOpen(!sidebarOpen) }), _jsxs("div", { style: { display: 'flex', flex: 1, overflow: 'hidden' }, children: [sidebarOpen && (_jsx("aside", { style: {
                            width: '250px',
                            background: 'white',
                            borderRight: '1px solid var(--border-color)',
                            padding: '20px',
                            overflow: 'auto',
                        }, children: _jsx("nav", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: navItems.map((item) => (_jsxs("button", { onClick: () => {
                                    setCurrentPage(item.page);
                                }, style: {
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: currentPage === item.page
                                        ? 'rgba(196, 30, 58, 0.1)'
                                        : 'transparent',
                                    color: currentPage === item.page
                                        ? 'var(--bam-red)'
                                        : 'var(--text-secondary)',
                                    fontWeight: currentPage === item.page ? 600 : 400,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    transition: 'background-color 0.2s',
                                }, children: [item.icon, item.label] }, item.page))) }) })), _jsx("main", { style: {
                            flex: 1,
                            overflow: 'auto',
                            background: 'white',
                        }, children: renderPage() })] })] }));
}
export default App;
