import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { getDatabase, closeDatabase } from './database/db.js'
import policiesRouter from './routes/policies.js'
import usersRouter from './routes/users.js'
import complianceRouter from './routes/compliance.js'
import importRouter from './routes/import.js'
import exportRouter from './routes/export.js'
import auditRouter from './routes/audit.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors() as any)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Initialize database on startup
try {
  getDatabase()
  console.log('✓ Database initialized')
} catch (error) {
  console.error('Failed to initialize database:', error)
  process.exit(1)
}

// Routes
app.use('/api/policies', policiesRouter)
app.use('/api/users', usersRouter)
app.use('/api/compliance', complianceRouter)
app.use('/api/import', importRouter)
app.use('/api/export', exportRouter)
app.use('/api/audit', auditRouter)

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Azure Policy Lens API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      policies: '/api/policies',
      compliance: '/api/compliance',
      users: '/api/users',
      import: '/api/import',
      export: '/api/export',
      audit: '/api/audit',
    },
  })
})

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
  console.log(`✓ API documentation: http://localhost:${PORT}/`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✓ Shutting down gracefully...')
  closeDatabase()
  process.exit(0)
})

export default app
