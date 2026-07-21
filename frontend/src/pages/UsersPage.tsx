import { useEffect, useState } from 'react'
import { useAppStore, User } from '../store'
import { apiClient } from '../api'
import { Plus, Trash2 } from 'lucide-react'

export const UsersPage = () => {
  const { currentUser } = useAppStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUser, setNewUser] = useState({ email: '', role: 'user' })

  const isAdmin = currentUser?.role === 'admin'

  useEffect(() => {
    if (!isAdmin) return

    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getUsers()
        setUsers(response.data || [])
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [isAdmin])

  const handleAddUser = async () => {
    if (!newUser.email) return

    try {
      await apiClient.createUser(newUser.email, newUser.role)
      setNewUser({ email: '', role: 'user' })
      setShowAddForm(false)
      // Refetch users
      const response = await apiClient.getUsers()
      setUsers(response.data || [])
    } catch (error) {
      console.error('Failed to add user:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure?')) return

    try {
      await apiClient.deleteUser(userId)
      const response = await apiClient.getUsers()
      setUsers(response.data || [])
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  if (!isAdmin) {
    return <div style={{ padding: '20px' }}>Access denied. Admin role required.</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>User Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="button-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {showAddForm && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
              }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
              }}
            >
              <option value="user">User (Read-only)</option>
              <option value="superuser">Superuser (Read/Write)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleAddUser} className="button-primary">Create</button>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-light)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    {user.email !== 'richard.van.berge.henegouwen@bam.com' && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--bam-red)',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
