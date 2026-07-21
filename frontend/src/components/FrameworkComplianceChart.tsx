import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface FrameworkComplianceChartProps {
  data: Array<{
    framework: string
    compliant: number
    non_compliant: number
  }>
}

export const FrameworkComplianceChart = ({ data }: FrameworkComplianceChartProps) => {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="framework" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="compliant" stackId="a" fill="#28a745" />
          <Bar dataKey="non_compliant" stackId="a" fill="#c41e3a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
