import express, { Request, Response } from 'express'
import { getDatabase } from '../database/db.js'

const router = express.Router()

// Get overall compliance summary
router.get('/', (_req: Request, res: Response) => {
  try {
    const db = getDatabase()

    const result = db
      .prepare(
        `SELECT 
          SUM(compliance_count) as compliant,
          SUM(non_compliance_count) as non_compliant
        FROM policies`
      )
      .get() as any

    res.json({
      compliant: result.compliant || 0,
      non_compliant: result.non_compliant || 0,
    })
  } catch (error) {
    console.error('Error fetching compliance:', error)
    res.status(500).json({ error: 'Failed to fetch compliance data' })
  }
})

// Get compliance by framework
router.get('/frameworks', (_req: Request, res: Response) => {
  try {
    const db = getDatabase()

    const results = db
      .prepare(
        `SELECT 
          framework,
          SUM(compliance_count) as compliant,
          SUM(non_compliance_count) as non_compliant
        FROM policies
        WHERE framework IS NOT NULL
        GROUP BY framework
        ORDER BY framework`
      )
      .all()

    const frameworks = (results as any[]).map((row) => ({
      framework: row.framework,
      compliant: row.compliant || 0,
      non_compliant: row.non_compliant || 0,
      compliance_rating:
        row.compliant + row.non_compliant > 0
          ? ((row.compliant / (row.compliant + row.non_compliant)) * 100).toFixed(1)
          : 0,
    }))

    res.json(frameworks)
  } catch (error) {
    console.error('Error fetching frameworks:', error)
    res.status(500).json({ error: 'Failed to fetch frameworks' })
  }
})

export default router
