import { Menu, LogOut, User, Settings } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  userEmail?: string
  onLogout?: () => void
  onToggleSidebar?: () => void
}

export const Header = ({ userEmail, onLogout, onToggleSidebar }: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const version = '1.0.0'

  return (
    <header
      style={{
        background: 'white',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Menu size={24} color="#c41e3a" />
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          Azure Policy Lens
          <span className="app-version">v{version}</span>
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-light)',
          }}
        >
          <User size={18} />
          <span style={{ fontSize: '0.875rem' }}>{userEmail || 'Guest'}</span>
        </div>

        {showUserMenu && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              minWidth: '200px',
            }}
          >
            <a
              href="#/settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <Settings size={16} />
              Settings
            </a>
            <button
              onClick={() => {
                onLogout?.()
                setShowUserMenu(false)
              }}
              style={{
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
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
