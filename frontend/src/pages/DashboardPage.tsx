import { useEffect, useState } from 'react'
import { useAppStore } from '../store'
import { apiClient } from '../api'
import { ComplianceChart } from '../components/ComplianceChart'
import { FrameworkComplianceChart } from '../components/FrameworkComplianceChart'

export const DashboardPage = () => {
  const { complianceData } = useAppStore()
  const [totalStats, setTotalStats] = useState({
    compliant: 0,
    non_compliant: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.getCompliance()
        if (response.data) {
          const compliant = response.data.compliant || 0
          const non_compliant = response.data.non_compliant || 0
          setTotalStats({ compliant, non_compliant })
        }
      } catch (error) {
        console.error('Failed to fetch compliance data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Compliance Dashboard</h2>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <div className="kpi-card">
          <div className="kpi-label">Total Compliant</div>
          <div className="kpi-value">{totalStats.compliant}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Resources in compliance
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Non-Compliant</div>
          <div
            className="kpi-value"
            style={{ color: '#c41e3a' }}
          >
            {totalStats.non_compliant}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Resources requiring attention
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Compliance Rate</div>
          <div className="kpi-value">
            {totalStats.compliant + totalStats.non_compliant > 0
              ? (
                  (totalStats.compliant /
                    (totalStats.compliant + totalStats.non_compliant)) *
                  100
                ).toFixed(1)
              : '0'}
            %
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Overall compliance
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ marginBottom: '30px' }}>
        <ComplianceChart
          compliant={totalStats.compliant}
          non_compliant={totalStats.non_compliant}
          title="Overall Compliance Status"
        />
      </div>

      {complianceData.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '20px' }}>Compliance by Framework</h3>
          <FrameworkComplianceChart data={complianceData} />
        </div>
      )}
    </div>
  )
}
