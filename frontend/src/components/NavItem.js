import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const NavItem = ({ label, href, icon, isActive, onClick }) => (_jsxs("a", { href: href, onClick: onClick, className: `nav-item ${isActive ? 'active' : ''}`, style: {
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
        backgroundColor: isActive ? 'rgba(196, 30, 58, 0.1)' : 'transparent',
        color: isActive ? '#c41e3a' : 'var(--text-secondary)',
        fontWeight: isActive ? 600 : 400,
    }, children: [icon && _jsx("span", { style: { fontSize: '18px' }, children: icon }), label] }));
