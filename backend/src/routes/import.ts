import express, { Request, Response } from 'express'
import { getDatabase } from '../database/db.js'
import { randomUUID } from 'crypto'
import multer from 'multer'
import csv from 'csv-parser'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Import policies from CSV
router.post('/policies', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const userEmail = req.headers['x-user-email'] as string

    if (!req.file) {
      res.status(400).json({ error: 'No file provided' })
      return
    }

    const db = getDatabase()
    const importId = randomUUID()

    const fileContent = req.file.buffer.toString('utf-8')
    const lines = fileContent.split('\n')
    const headers = lines[0].split(',').map((h) => h.trim())

    let rowCount = 0
    const statement = db.prepare(`
      INSERT OR REPLACE INTO policies (
        id, display_name, category, status, compliance_count,
        non_compliance_count, framework, scope, assigned_by, created_on
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const transaction = db.transaction(() => {
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const values = line.split(',').map((v) => v.trim().replace(/^"/, '').replace(/"$/, ''))
        const row: any = {}

        headers.forEach((header, index) => {
          row[header] = values[index]
        })

        statement.run(
          row.id || randomUUID(),
          row.display_name,
          row.category,
          row.status,
          parseInt(row.compliance_count) || 0,
          parseInt(row.non_compliance_count) || 0,
          row.framework,
          row.scope,
          row.assigned_by,
          row.created_on
        )

        rowCount++
      }

      // Log import
      const auditId = randomUUID()
      db.prepare(
        `INSERT INTO audit_logs (id, action, user_email, resource_id, resource_type, status)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(auditId, 'IMPORT_POLICIES', userEmail, importId, 'IMPORT', 'SUCCESS')

      db.prepare(
        `INSERT INTO import_logs (id, user_email, file_name, row_count, status)
         VALUES (?, ?, ?, ?, ?)`
      ).run(importId, userEmail, req.file?.originalname, rowCount, 'SUCCESS')
    })

    transaction()

    res.json({ message: `Successfully imported ${rowCount} policies`, rowCount })
  } catch (error) {
    console.error('Error importing policies:', error)

    const userEmail = req.headers['x-user-email'] as string
    const importId = randomUUID()
    const db = getDatabase()

    db.prepare(
      `INSERT INTO import_logs (id, user_email, file_name, status, error_message)
       VALUES (?, ?, ?, ?, ?)`
    ).run(importId, userEmail, req.file?.originalname, 'FAILED', error instanceof Error ? error.message : 'Unknown error')

    res.status(500).json({ error: 'Failed to import policies' })
  }
})

export default router
