import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

interface ComplianceChartProps {
  compliant: number
  non_compliant: number
  title: string
}

export const ComplianceChart = ({ compliant, non_compliant, title }: ComplianceChartProps) => {
  const total = compliant + non_compliant
  const compliancePercent = total > 0 ? ((compliant / total) * 100).toFixed(1) : '0'

  const data = [
    { name: 'Compliant', value: compliant, fill: '#28a745' },
    { name: 'Non-Compliant', value: non_compliant, fill: '#c41e3a' },
  ]

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c41e3a', margin: '10px 0' }}>
        {compliancePercent}% Compliant
      </p>
    </div>
  )
}
