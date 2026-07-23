import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { apiClient } from '../api';
import { ComplianceChart } from '../components/ComplianceChart';
import { FrameworkComplianceChart } from '../components/FrameworkComplianceChart';
export const DashboardPage = () => {
    const { complianceData } = useAppStore();
    const [totalStats, setTotalStats] = useState({
        compliant: 0,
        non_compliant: 0,
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.getCompliance();
                if (response.data) {
                    const compliant = response.data.compliant || 0;
                    const non_compliant = response.data.non_compliant || 0;
                    setTotalStats({ compliant, non_compliant });
                }
            }
            catch (error) {
                console.error('Failed to fetch compliance data:', error);
            }
        };
        fetchData();
    }, []);
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsx("h2", { style: { marginBottom: '20px' }, children: "Compliance Dashboard" }), _jsxs("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px',
                }, children: [_jsxs("div", { className: "kpi-card", children: [_jsx("div", { className: "kpi-label", children: "Total Compliant" }), _jsx("div", { className: "kpi-value", children: totalStats.compliant }), _jsx("div", { style: { fontSize: '0.875rem', color: 'var(--text-secondary)' }, children: "Resources in compliance" })] }), _jsxs("div", { className: "kpi-card", children: [_jsx("div", { className: "kpi-label", children: "Total Non-Compliant" }), _jsx("div", { className: "kpi-value", style: { color: '#c41e3a' }, children: totalStats.non_compliant }), _jsx("div", { style: { fontSize: '0.875rem', color: 'var(--text-secondary)' }, children: "Resources requiring attention" })] }), _jsxs("div", { className: "kpi-card", children: [_jsx("div", { className: "kpi-label", children: "Compliance Rate" }), _jsxs("div", { className: "kpi-value", children: [totalStats.compliant + totalStats.non_compliant > 0
                                        ? ((totalStats.compliant /
                                            (totalStats.compliant + totalStats.non_compliant)) *
                                            100).toFixed(1)
                                        : '0', "%"] }), _jsx("div", { style: { fontSize: '0.875rem', color: 'var(--text-secondary)' }, children: "Overall compliance" })] })] }), _jsx("div", { style: { marginBottom: '30px' }, children: _jsx(ComplianceChart, { compliant: totalStats.compliant, non_compliant: totalStats.non_compliant, title: "Overall Compliance Status" }) }), complianceData.length > 0 && (_jsxs("div", { children: [_jsx("h3", { style: { marginBottom: '20px' }, children: "Compliance by Framework" }), _jsx(FrameworkComplianceChart, { data: complianceData })] }))] }));
};
