import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiClient } from '../api';
import { Download } from 'lucide-react';
export const PoliciesPage = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                setLoading(true);
                const response = await apiClient.getPolicies({ limit: 100 });
                setPolicies(response.data || []);
            }
            catch (error) {
                console.error('Failed to fetch policies:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);
    const filteredPolicies = policies.filter((p) => p.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleExport = async () => {
        try {
            const response = await apiClient.exportPolicies();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `policies-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentElement?.removeChild(link);
        }
        catch (error) {
            console.error('Failed to export policies:', error);
        }
    };
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }, children: [_jsx("h2", { children: "Policy Assignments" }), _jsxs("button", { onClick: handleExport, className: "button-primary", style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(Download, { size: 16 }), "Export CSV"] })] }), _jsx("div", { style: { marginBottom: '20px' }, children: _jsx("input", { type: "text", placeholder: "Search policies...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), style: {
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.875rem',
                    } }) }), loading ? (_jsx("p", { children: "Loading policies..." })) : (_jsx("div", { className: "table-responsive", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Display Name" }), _jsx("th", { children: "Category" }), _jsx("th", { children: "Framework" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Compliant" }), _jsx("th", { children: "Non-Compliant" }), _jsx("th", { children: "Created On" })] }) }), _jsx("tbody", { children: filteredPolicies.map((policy) => (_jsxs("tr", { children: [_jsx("td", { children: policy.display_name }), _jsx("td", { children: policy.category }), _jsx("td", { children: policy.framework }), _jsx("td", { children: _jsx("span", { className: `status-badge ${policy.status === 'compliant'
                                                ? 'status-compliant'
                                                : 'status-non-compliant'}`, children: policy.status }) }), _jsx("td", { children: policy.compliance_count }), _jsx("td", { children: policy.non_compliance_count }), _jsx("td", { children: new Date(policy.created_on).toLocaleDateString() })] }, policy.id))) })] }) }))] }));
};
