import { ReactNode } from 'react'

interface NavItemProps {
  label: string
  href: string
  icon?: ReactNode
  isActive?: boolean
  onClick?: () => void
}

export const NavItem = ({ label, href, icon, isActive, onClick }: NavItemProps) => (
  <a
    href={href}
    onClick={onClick}
    className={`nav-item ${isActive ? 'active' : ''}`}
    style={{
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      borderRadius: '4px',
      transition: 'background-color 0.2s',
      backgroundColor: isActive ? 'rgba(196, 30, 58, 0.1)' : 'transparent',
      color: isActive ? '#c41e3a' : 'var(--text-secondary)',
      fontWeight: isActive ? 600 : 400,
    }}
  >
    {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
    {label}
  </a>
)
