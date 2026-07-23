import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
export const ComplianceChart = ({ compliant, non_compliant, title }) => {
    const total = compliant + non_compliant;
    const compliancePercent = total > 0 ? ((compliant / total) * 100).toFixed(1) : '0';
    const data = [
        { name: 'Compliant', value: compliant, fill: '#28a745' },
        { name: 'Non-Compliant', value: non_compliant, fill: '#c41e3a' },
    ];
    return (_jsxs("div", { style: { width: '100%', textAlign: 'center' }, children: [_jsx("h3", { children: title }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data, cx: "50%", cy: "50%", labelLine: false, label: ({ name, value }) => `${name}: ${value}`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: data.map((entry, index) => (_jsx(Cell, { fill: entry.fill }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) }), _jsxs("p", { style: { fontSize: '1.5rem', fontWeight: 'bold', color: '#c41e3a', margin: '10px 0' }, children: [compliancePercent, "% Compliant"] })] }));
};
