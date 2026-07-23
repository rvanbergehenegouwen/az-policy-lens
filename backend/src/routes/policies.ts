import express, { Request, Response } from 'express'
import { getDatabase } from '../database/db.js'

const router = express.Router()

// Get all policies
router.get('/', (req: Request, res: Response) => {
  try {
    const db = getDatabase()
    const skip = parseInt(req.query.skip as string) || 0
    const limit = parseInt(req.query.limit as string) || 50

    const policies = db
      .prepare('SELECT * FROM policies ORDER BY created_on DESC LIMIT ? OFFSET ?')
      .all(limit, skip)

    const total = (db.prepare('SELECT COUNT(*) as count FROM policies').get() as any).count

    res.json({ data: policies, total, skip, limit })
  } catch (error) {
    console.error('Error fetching policies:', error)
    res.status(500).json({ error: 'Failed to fetch policies' })
  }
})

// Get policy by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const db = getDatabase()
    const policy = db.prepare('SELECT * FROM policies WHERE id = ?').get(req.params.id)

    if (!policy) {
      res.status(404).json({ error: 'Policy not found' })
      return
    }

    res.json(policy)
  } catch (error) {
    console.error('Error fetching policy:', error)
    res.status(500).json({ error: 'Failed to fetch policy' })
  }
})

// Search policies
router.get('/search', (req: Request, res: Response) => {
  try {
    const db = getDatabase()
    const q = (req.query.q as string) || ''

    const policies = db
      .prepare(
        `SELECT * FROM policies 
        WHERE display_name LIKE ? OR category LIKE ? OR framework LIKE ?
        ORDER BY created_on DESC LIMIT 100`
      )
      .all(`%${q}%`, `%${q}%`, `%${q}%`)

    res.json(policies)
  } catch (error) {
    console.error('Error searching policies:', error)
    res.status(500).json({ error: 'Failed to search policies' })
  }
})

export default router
