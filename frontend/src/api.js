import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add user email header if available
api.interceptors.request.use((config) => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        config.headers['x-user-email'] = userEmail;
    }
    return config;
});
export const apiClient = {
    // Compliance endpoints
    getCompliance: () => api.get('/api/compliance'),
    getComplianceFrameworks: () => api.get('/api/compliance/frameworks'),
    // Policy endpoints
    getPolicies: (params) => api.get('/api/policies', { params }),
    getPolicyById: (id) => api.get(`/api/policies/${id}`),
    searchPolicies: (query) => api.get('/api/policies/search', { params: { q: query } }),
    // User endpoints
    getCurrentUser: () => api.get('/api/me'),
    getUsers: () => api.get('/api/users'),
    createUser: (email, role) => api.post('/api/users', { email, role }),
    updateUser: (id, role) => api.patch(`/api/users/${id}`, { role }),
    deleteUser: (id) => api.delete(`/api/users/${id}`),
    // Import/Export endpoints
    importPolicies: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/api/import/policies', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    exportPolicies: () => api.get('/api/export/policies', { responseType: 'blob' }),
    exportReport: () => api.get('/api/export/report', { responseType: 'blob' }),
    // Audit endpoints
    getAuditLogs: (params) => api.get('/api/audit', { params }),
};
