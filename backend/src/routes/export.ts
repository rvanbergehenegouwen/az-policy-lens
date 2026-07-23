import express, { Request, Response } from 'express'
import { getDatabase } from '../database/db.js'

const router = express.Router()

// Export policies as CSV
router.get('/policies', (_req: Request, res: Response) => {
  try {
    const db = getDatabase()

    const policies = db.prepare('SELECT * FROM policies').all()

    // Build CSV
    const headers = [
      'id',
      'display_name',
      'category',
      'status',
      'compliance_count',
      'non_compliance_count',
      'framework',
      'scope',
      'assigned_by',
      'created_on',
    ]

    let csv = headers.join(',') + '\n'

    for (const policy of policies as any[]) {
      csv += [
        policy.id,
        `"${policy.display_name || ''}"`,
        policy.category || '',
        policy.status || '',
        policy.compliance_count || 0,
        policy.non_compliance_count || 0,
        policy.framework || '',
        `"${policy.scope || ''}"`,
        policy.assigned_by || '',
        policy.created_on || '',
      ].join(',')
      csv += '\n'
    }

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="policies-${new Date().toISOString().split('T')[0]}.csv"`
    )
    res.send(csv)
  } catch (error) {
    console.error('Error exporting policies:', error)
    res.status(500).json({ error: 'Failed to export policies' })
  }
})

// Export compliance report
router.get('/report', (_req: Request, res: Response) => {
  try {
    const db = getDatabase()

    const policies = db.prepare('SELECT * FROM policies').all()
    const compliance = db
      .prepare(
        `SELECT 
          SUM(compliance_count) as compliant,
          SUM(non_compliance_count) as non_compliant
        FROM policies`
      )
      .get() as any

    const report = {
      generated_at: new Date().toISOString(),
      total_policies: (policies as any[]).length,
      compliance_summary: {
        compliant: compliance.compliant || 0,
        non_compliant: compliance.non_compliant || 0,
        compliance_rate:
          (compliance.compliant || 0) + (compliance.non_compliant || 0) > 0
            ? (
                ((compliance.compliant || 0) /
                  ((compliance.compliant || 0) + (compliance.non_compliant || 0))) *
                100
              ).toFixed(1)
            : 0,
      },
      policies,
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="compliance-report-${new Date().toISOString().split('T')[0]}.json"`
    )
    res.json(report)
  } catch (error) {
    console.error('Error generating report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

export default router
