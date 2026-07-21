Node.js Backend API for Azure Policy Lens

## Setup

```bash
cd backend
npm install
npm run dev
```

Server runs on http://localhost:3001

## Database

SQLite database with tables for:
- `users` — User accounts and roles
- `policies` — Policy assignments and compliance data
- `audit_logs` — Audit trail for sensitive operations
- `import_logs` — Data import history

Auto-initialized on startup with default admin user.

## Environment Variables

```bash
DATABASE_PATH=./data/policies.db
PORT=3001
NODE_ENV=development
AUDIT_RETENTION_DAYS=1
```

## API Routes

### Compliance
- `GET /api/compliance` — Overall compliance summary
- `GET /api/compliance/frameworks` — Compliance by framework

### Policies
- `GET /api/policies` — List policies (paginated)
- `GET /api/policies/:id` — Get policy details
- `GET /api/policies/search?q=...` — Search policies

### Users
- `GET /api/me` — Current user info
- `GET /api/users` — List users (admin only)
- `POST /api/users` — Create user (admin only)
- `PATCH /api/users/:id` — Update user role (admin only)
- `DELETE /api/users/:id` — Delete user (admin only)

### Import/Export
- `POST /api/import/policies` — Import policies CSV
- `GET /api/export/policies` — Export policies CSV
- `GET /api/export/report` — Export full compliance report

### Audit
- `GET /api/audit` — Audit logs (admin only)
