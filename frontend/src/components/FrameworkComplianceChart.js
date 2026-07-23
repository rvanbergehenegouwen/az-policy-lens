import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
export const FrameworkComplianceChart = ({ data }) => {
    return (_jsx("div", { className: "chart-container", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "framework" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "compliant", stackId: "a", fill: "#28a745" }), _jsx(Bar, { dataKey: "non_compliant", stackId: "a", fill: "#c41e3a" })] }) }) }));
};
