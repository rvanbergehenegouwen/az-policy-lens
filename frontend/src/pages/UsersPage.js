import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { apiClient } from '../api';
import { Plus, Trash2 } from 'lucide-react';
export const UsersPage = () => {
    const { currentUser } = useAppStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', role: 'user' });
    const isAdmin = currentUser?.role === 'admin';
    useEffect(() => {
        if (!isAdmin)
            return;
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await apiClient.getUsers();
                setUsers(response.data || []);
            }
            catch (error) {
                console.error('Failed to fetch users:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [isAdmin]);
    const handleAddUser = async () => {
        if (!newUser.email)
            return;
        try {
            await apiClient.createUser(newUser.email, newUser.role);
            setNewUser({ email: '', role: 'user' });
            setShowAddForm(false);
            // Refetch users
            const response = await apiClient.getUsers();
            setUsers(response.data || []);
        }
        catch (error) {
            console.error('Failed to add user:', error);
        }
    };
    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure?'))
            return;
        try {
            await apiClient.deleteUser(userId);
            const response = await apiClient.getUsers();
            setUsers(response.data || []);
        }
        catch (error) {
            console.error('Failed to delete user:', error);
        }
    };
    if (!isAdmin) {
        return _jsx("div", { style: { padding: '20px' }, children: "Access denied. Admin role required." });
    }
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }, children: [_jsx("h2", { children: "User Management" }), _jsxs("button", { onClick: () => setShowAddForm(!showAddForm), className: "button-primary", style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(Plus, { size: 16 }), "Add User"] })] }), showAddForm && (_jsxs("div", { style: {
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid var(--border-color)',
                }, children: [_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '4px', fontWeight: 500 }, children: "Email" }), _jsx("input", { type: "email", value: newUser.email, onChange: (e) => setNewUser({ ...newUser, email: e.target.value }), style: {
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                } })] }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '4px', fontWeight: 500 }, children: "Role" }), _jsxs("select", { value: newUser.role, onChange: (e) => setNewUser({ ...newUser, role: e.target.value }), style: {
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                }, children: [_jsx("option", { value: "user", children: "User (Read-only)" }), _jsx("option", { value: "superuser", children: "Superuser (Read/Write)" }), _jsx("option", { value: "admin", children: "Admin (Full Access)" })] })] }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("button", { onClick: handleAddUser, className: "button-primary", children: "Create" }), _jsx("button", { onClick: () => setShowAddForm(false), style: {
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    cursor: 'pointer',
                                }, children: "Cancel" })] })] })), loading ? (_jsx("p", { children: "Loading users..." })) : (_jsx("div", { className: "table-responsive", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Email" }), _jsx("th", { children: "Role" }), _jsx("th", { children: "Created" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: users.map((user) => (_jsxs("tr", { children: [_jsx("td", { children: user.email }), _jsx("td", { children: _jsx("span", { style: {
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                backgroundColor: 'var(--bg-light)',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                            }, children: user.role }) }), _jsx("td", { children: new Date(user.created_at).toLocaleDateString() }), _jsx("td", { children: user.email !== 'richard.van.berge.henegouwen@bam.com' && (_jsx("button", { onClick: () => handleDeleteUser(user.id), style: {
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--bam-red)',
                                                cursor: 'pointer',
                                                padding: '4px',
                                            }, children: _jsx(Trash2, { size: 16 }) })) })] }, user.id))) })] }) }))] }));
};
