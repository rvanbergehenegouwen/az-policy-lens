import express, { Request, Response } from 'express'
import { getDatabase } from '../database/db.js'

const router = express.Router()

// Get audit logs (admin only)
router.get('/', (req: Request, res: Response) => {
  try {
    const userEmail = req.headers['x-user-email'] as string
    const db = getDatabase()
    const currentUser = db.prepare('SELECT * FROM users WHERE email = ?').get(userEmail) as any

    if (!currentUser || currentUser.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' })
      return
    }

    const skip = parseInt(req.query.skip as string) || 0
    const limit = parseInt(req.query.limit as string) || 50

    const logs = db
      .prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(limit, skip)

    const total = (db.prepare('SELECT COUNT(*) as count FROM audit_logs').get() as any).count

    res.json({ data: logs, total, skip, limit })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    res.status(500).json({ error: 'Failed to fetch audit logs' })
  }
})

export default router
