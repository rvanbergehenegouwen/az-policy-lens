import { useEffect, useState } from 'react'
import { PolicyAssignment } from '../store'
import { apiClient } from '../api'
import { Download } from 'lucide-react'

export const PoliciesPage = () => {
  const [policies, setPolicies] = useState<PolicyAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getPolicies({ limit: 100 })
        setPolicies(response.data || [])
      } catch (error) {
        console.error('Failed to fetch policies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  const filteredPolicies = policies.filter((p) =>
    p.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExport = async () => {
    try {
      const response = await apiClient.exportPolicies()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `policies-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.parentElement?.removeChild(link)
    } catch (error) {
      console.error('Failed to export policies:', error)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Policy Assignments</h2>
        <button onClick={handleExport} className="button-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search policies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
            fontSize: '0.875rem',
          }}
        />
      </div>

      {loading ? (
        <p>Loading policies...</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Display Name</th>
                <th>Category</th>
                <th>Framework</th>
                <th>Status</th>
                <th>Compliant</th>
                <th>Non-Compliant</th>
                <th>Created On</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map((policy) => (
                <tr key={policy.id}>
                  <td>{policy.display_name}</td>
                  <td>{policy.category}</td>
                  <td>{policy.framework}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        policy.status === 'compliant'
                          ? 'status-compliant'
                          : 'status-non-compliant'
                      }`}
                    >
                      {policy.status}
                    </span>
                  </td>
                  <td>{policy.compliance_count}</td>
                  <td>{policy.non_compliance_count}</td>
                  <td>{new Date(policy.created_on).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
