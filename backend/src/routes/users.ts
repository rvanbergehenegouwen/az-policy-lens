import express, { Request, Response } from 'express'
import { getDatabase } from '../database/db.js'
import { randomUUID } from 'crypto'

const router = express.Router()

// Get current user
router.get('/me', (req: Request, res: Response) => {
  try {
    const userEmail = req.headers['x-user-email'] as string

    if (!userEmail) {
      res.status(401).json({ error: 'User email not provided' })
      return
    }

    const db = getDatabase()
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(userEmail)

    // Create user if doesn't exist
    if (!user) {
      const userId = randomUUID()
      db.prepare('INSERT INTO users (id, email, role) VALUES (?, ?, ?)').run(
        userId,
        userEmail,
        'user'
      )
      user = { id: userId, email: userEmail, role: 'user', created_at: new Date().toISOString() }
    }

    res.json(user)
  } catch (error) {
    console.error('Error fetching current user:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Get all users (admin only)
router.get('/', (req: Request, res: Response) => {
  try {
    const userEmail = req.headers['x-user-email'] as string
    const db = getDatabase()
    const currentUser = db.prepare('SELECT * FROM users WHERE email = ?').get(userEmail) as any

    if (!currentUser || currentUser.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' })
      return
    }

    const users = db.prepare('SELECT id, email, role, created_at FROM users').all()
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Create user (admin only)
router.post('/', (req: Request, res: Response) => {
  try {
    const userEmail = req.headers['x-user-email'] as string
    const { email, role } = req.body

    const db = getDatabase()
    const currentUser = db.prepare('SELECT * FROM users WHERE email = ?').get(userEmail) as any

    if (!currentUser || currentUser.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' })
      return
    }

    const userId = randomUUID()
    db.prepare('INSERT INTO users (id, email, role) VALUES (?, ?, ?)').run(
      userId,
      email,
      role || 'user'
    )

    // Audit log
    const auditId = randomUUID()
    db.prepare(
      `INSERT INTO audit_logs (id, action, user_email, resource_id, resource_type, status)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(auditId, 'CREATE_USER', userEmail, userId, 'USER', 'SUCCESS')

    res.status(201).json({ id: userId, email, role })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// Update user (admin only)
router.patch('/:id', (req: Request, res: Response) => {
  try {
    const userEmail = req.headers['x-user-email'] as string
    const { role } = req.body

    const db = getDatabase()
    const currentUser = db.prepare('SELECT * FROM users WHERE email = ?').get(userEmail) as any

    if (!currentUser || currentUser.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' })
      return
    }

    // Prevent changing default admin
    const targetUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id) as any
    if (targetUser?.email === 'richard.van.berge.henegouwen@bam.com') {
      res.status(403).json({ error: 'Cannot modify default admin user' })
      return
    }

    db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(
      role,
      req.params.id
    )

    // Audit log
    const auditId = randomUUID()
    db.prepare(
      `INSERT INTO audit_logs (id, action, user_email, resource_id, resource_type, status, details)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(auditId, 'UPDATE_USER_ROLE', userEmail, req.params.id, 'USER', 'SUCCESS', JSON.stringify({ role }))

    res.json({ id: req.params.id, role })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// Delete user (admin only)
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const userEmail = req.headers['x-user-email'] as string

    const db = getDatabase()
    const currentUser = db.prepare('SELECT * FROM users WHERE email = ?').get(userEmail) as any

    if (!currentUser || currentUser.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' })
      return
    }

    // Prevent deleting default admin
    const targetUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id) as any
    if (targetUser?.email === 'richard.van.berge.henegouwen@bam.com') {
      res.status(403).json({ error: 'Cannot delete default admin user' })
      return
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id)

    // Audit log
    const auditId = randomUUID()
    db.prepare(
      `INSERT INTO audit_logs (id, action, user_email, resource_id, resource_type, status)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(auditId, 'DELETE_USER', userEmail, req.params.id, 'USER', 'SUCCESS')

    res.status(204).send()
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

export default router
