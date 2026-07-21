# Azure Policy Lens

**Azure Policy Compliance Dashboard** — Visualize, analyze, and manage Azure policy assignments across your subscriptions with real-time compliance tracking.

## Overview

Azure Policy Lens provides a unified dashboard for:
- 📊 **Compliance Monitoring**: Track compliance status across security frameworks (Cyber Essentials, MCSB)
- 🔍 **Policy Drilldown**: Explore policy assignments, definitions, and resource compliance
- 📈 **Framework Analysis**: View compliance ratings by security control category
- 📁 **Data Import**: Bulk import compliance data from Azure Policy exports
- 📋 **CSV Export**: Export compliance reports and policy assignments
- 👥 **Role-Based Access**: Manage users, roles, and audit trails
- 🔐 **Security**: Audit logging for sensitive operations

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Node.js + Express
- **Database**: SQLite (LibSQL)
- **Infrastructure**: Azure App Service (azd/Bicep)
- **Auth**: Azure AD / Passwordless (configurable)

## Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Azure CLI (for azd deployments)
- PowerShell 7+ (for import scripts)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   npm run dev:backend
   npm run dev:frontend
   ```

2. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

3. **Import sample data:**
   ```bash
   # PowerShell: Export compliance data
   .\scripts\Export-Policies.ps1 -OutputPath ./data/policies.csv

   # Browser: Use Import tab to upload CSV
   ```

## Project Structure

```
az-policy-lens/
├── frontend/              # React + Vite dashboard
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components (Dashboard, Compliance, etc.)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── backend/              # Express API server
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── database/     # SQLite schemas & migrations
│   │   ├── server.ts
│   │   └── middleware/
│   └── package.json
├── infra/                # Azure Bicep infrastructure
│   ├── main.bicep
│   ├── app-service.bicep
│   └── database.bicep
├── scripts/              # PowerShell export utilities
│   ├── Export-Policies.ps1
│   └── Export-All.ps1
├── .github/workflows/    # CI/CD (GitHub Actions)
│   └── deploy.yml
├── azure.yaml            # azd configuration
└── README.md
```

## API Endpoints

### Compliance Data
- `GET /api/compliance` — Overall compliance summary
- `GET /api/compliance/frameworks` — Framework-specific compliance
- `GET /api/policies` — List all policy assignments
- `GET /api/policies/:id` — Policy details
- `GET /api/policies/search` — Search policies

### Users & Roles
- `GET /api/me` — Current user info
- `GET /api/users` — List users
- `POST /api/users` — Create user (admin only)
- `PATCH /api/users/:id` — Update user role
- `DELETE /api/users/:id` — Delete user (admin only)

### Import & Export
- `POST /api/import/policies` — Upload compliance CSV
- `GET /api/export/policies` — Export policies as CSV
- `GET /api/export/report` — Export full compliance report

### Audit
- `GET /api/audit` — Audit logs (admin only)

## Dashboard Tabs

### 1. **Dashboard**
- Compliance score cards (% compliant by framework)
- Trend charts (compliance over time)
- Quick stats (total policies, non-compliant resources)

### 2. **Frameworks**
- Cyber Essentials v3.1 compliance breakdown
- Microsoft Cloud Security Benchmark (MCSB) v3.0 status
- Control-level compliance ratings

### 3. **Policies**
- Full list of policy assignments
- Filtering by status, category, scope
- Drilldown into policy details and resource compliance

### 4. **Cleanup**
- Identify non-compliant policies
- Remediation recommendations
- Risk-level assessment

### 5. **Import**
- Upload compliance data CSV
- Data validation and preview
- Bulk import with status tracking

### 6. **Users** (Admin)
- User and role management
- Audit log viewer
- Role descriptions and permissions

### 7. **Settings**
- App configuration
- Audit retention policy (default: 1 day)
- Database status

## Data Format

### Policy CSV Import
Expected columns:
```
policy_id,display_name,category,status,compliance_count,non_compliance_count,framework,scope,assigned_by,created_on
```

### Compliance CSV Export
Includes policy details, compliance status, and resource counts per policy.

## Configuration

### Environment Variables (Backend)

```bash
# Database
DATABASE_PATH=./data/policies.db

# Auth
AZURE_CLIENT_ID=<your-app-id>
AZURE_TENANT_ID=<your-tenant-id>

# App
PORT=3001
NODE_ENV=development
AUDIT_RETENTION_DAYS=1
DEFAULT_ADMIN_EMAIL=richard.van.berge.henegouwen@bam.com
DEFAULT_ENVIRONMENT=Royal BAM Group nv (default)
```

### Frontend Environment

```bash
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=Azure Policy Lens
```

## Deployment

### Azure Deployment (azd)

```bash
# Initialize azd
azd init

# Provision resources
azd provision

# Deploy app
azd deploy

# Go live (publish)
azd up
```

### Manual Deployment

```bash
# Build Docker image
docker build -t az-policy-lens:1.0.0 .

# Push to container registry
az acr build -t az-policy-lens:1.0.0 -r <acr-name> .

# Deploy to App Service
az webapp deployment container config --name <app-name> -g <rg-name>
```

## Database

SQLite database with tables for:
- `policies` — Policy assignments
- `frameworks` — Compliance frameworks
- `compliance_data` — Resource compliance status
- `import_logs` — Data import history
- `users` — User accounts and roles
- `audit_logs` — Sensitive action audit trail

Database is auto-initialized on server startup.

## Role-Based Access

| Role | Permissions |
|------|------------|
| `admin` | Full access; user management; audit logs |
| `superuser` | Read/write all data; no user management |
| `user` | Read-only access to assigned scope |

## Audit Logging

Sensitive actions are logged:
- User role changes
- Data imports
- Failed access attempts
- Policy updates

**Retention Policy**: Default 1 day (`AUDIT_RETENTION_DAYS=1`)

## Performance

- Caching for compliance data (5 min TTL)
- Indexed database queries
- Pagination for large datasets (default 50 items/page)
- Lazy loading for framework drilldowns

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: your feature"`
3. Push and open a Pull Request: `git push -u origin feature/your-feature`
4. CI/CD runs automated tests and deploys from `main`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Troubleshooting

### Port Already in Use
```bash
# Backend (port 3001)
npx kill-port 3001

# Frontend (port 5173)
npx kill-port 5173
```

### Database Locked
```bash
# Remove stale database lock
rm -f ./data/policies.db-wal ./data/policies.db-shm
```

### Import Fails
- Verify CSV column names match expected format
- Check file encoding is UTF-8
- Ensure data types are correct (dates in YYYY-MM-DD format)

## Compliance Frameworks

### Cyber Essentials v3.1
- Controls: Firewalls, User Access Control, Secure Configuration, Security Update Management, Malware Protection

### Microsoft Cloud Security Benchmark v3.0
- Domains: Asset Management, Data Protection, DevOps Security, Endpoint Security, Identity Management, Incident Response, Logging & Threat Detection, Network Security, Privileged Access, Posture & Vulnerability Management

## License

MIT © 2025 Richard van Berge Henegouwen

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/rvanbergehenegouwen/az-policy-lens/issues)
- Check [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for dev setup

---

**Version**: 1.0.0  
**Last Updated**: 2025-07-21
