import { useEffect, useState } from 'react'
import { useAppStore } from './store'
import { apiClient } from './api'
import { Header } from './components/Header'
import { DashboardPage } from './pages/DashboardPage'
import { PoliciesPage } from './pages/PoliciesPage'
import { UsersPage } from './pages/UsersPage'
import { ImportPage } from './pages/ImportPage'
import { BarChart3, Settings, Users, Upload, Home } from 'lucide-react'

function App() {
  const { currentUser, setCurrentUser } = useAppStore()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.getCurrentUser()
        setCurrentUser(response.data)
        const email = response.data.email
        localStorage.setItem('userEmail', email)
      } catch (error) {
        // User not authenticated - initialize as guest
        console.log('Guest mode')
      }
    }

    fetchUser()
  }, [setCurrentUser])

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('userEmail')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'policies':
        return <PoliciesPage />
      case 'users':
        return currentUser?.role === 'admin' ? <UsersPage /> : <div style={{ padding: '20px' }}>Access denied</div>
      case 'import':
        return <ImportPage />
      case 'settings':
        return <div style={{ padding: '20px' }}><h2>Settings</h2><p>Coming soon...</p></div>
      default:
        return <DashboardPage />
    }
  }

  const navItems = [
    { label: 'Dashboard', href: '#', page: 'dashboard', icon: <Home size={18} /> },
    { label: 'Policies', href: '#', page: 'policies', icon: <BarChart3 size={18} /> },
    { label: 'Import', href: '#', page: 'import', icon: <Upload size={18} /> },
    ...(currentUser?.role === 'admin'
      ? [{ label: 'Users', href: '#', page: 'users', icon: <Users size={18} /> }]
      : []),
    { label: 'Settings', href: '#', page: 'settings', icon: <Settings size={18} /> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <aside
            style={{
              width: '250px',
              background: 'white',
              borderRight: '1px solid var(--border-color)',
              padding: '20px',
              overflow: 'auto',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    setCurrentPage(item.page)
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    background:
                      currentPage === item.page
                        ? 'rgba(196, 30, 58, 0.1)'
                        : 'transparent',
                    color:
                      currentPage === item.page
                        ? 'var(--bam-red)'
                        : 'var(--text-secondary)',
                    fontWeight: currentPage === item.page ? 600 : 400,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            background: 'white',
          }}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
