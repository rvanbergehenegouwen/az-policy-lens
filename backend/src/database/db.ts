import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '../../data')
const dbPath = path.join(dataDir, 'policies.db')

let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const fs = await import('fs').then(m => m.promises)
    await fs.mkdir(dataDir, { recursive: true }).catch(() => {})
    
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    initializeDatabase(db)
  }
  return db
}

export function initializeDatabase(database: Database.Database): void {
  // Users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Policies table
  database.exec(`
    CREATE TABLE IF NOT EXISTS policies (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      category TEXT,
      status TEXT,
      compliance_count INTEGER DEFAULT 0,
      non_compliance_count INTEGER DEFAULT 0,
      framework TEXT,
      scope TEXT,
      assigned_by TEXT,
      created_on DATETIME,
      imported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Audit logs table
  database.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      user_email TEXT,
      resource_id TEXT,
      resource_type TEXT,
      status TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Import logs table
  database.exec(`
    CREATE TABLE IF NOT EXISTS import_logs (
      id TEXT PRIMARY KEY,
      user_email TEXT,
      file_name TEXT NOT NULL,
      row_count INTEGER,
      status TEXT,
      error_message TEXT,
      imported_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Seed default admin user
  try {
    database.exec(`
      INSERT OR IGNORE INTO users (id, email, role)
      VALUES ('admin-default', 'richard.van.berge.henegouwen@bam.com', 'admin')
    `)
  } catch (e) {
    // User already exists
  }
}

export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
  }
}
