# Development Setup Guide

## Prerequisites

- Node.js 20+
- npm or yarn
- Azure CLI (for cloud deployment)
- PowerShell 7+ (for import scripts)

## Local Development

### 1. Install Dependencies

```bash
# Root level
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Run Development Servers

**Option A: Both servers with single command**
```bash
npm run dev
```

**Option B: Separate terminals**

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Database

SQLite database is auto-initialized in `./data/policies.db`

### Default Admin User
- **Email**: richard.van.berge.henegouwen@bam.com
- **Role**: admin

Pass this email via `x-user-email` header to authenticate.

## Import Sample Data

### From CSV File

1. Export policies using PowerShell:
```bash
cd scripts
.\Export-All.ps1 -OutputPath ../data
cd ..
```

2. Load data via web UI:
   - Go to **Import** tab
   - Select CSV file
   - Click **Import**

### Manually

```bash
curl -X POST http://localhost:3001/api/import/policies \
  -H "x-user-email: richard.van.berge.henegouwen@bam.com" \
  -F "file=@./data/policies.csv"
```

## Building for Production

```bash
npm run build
```

Creates:
- `frontend/dist/` — React build
- `backend/dist/` — TypeScript compiled server

## Testing

```bash
npm run test
npm run test:backend
npm run test:frontend
```

## Deployment

### Azure Deployment (azd)

```bash
# Initialize
azd init

# Provision resources
azd provision

# Deploy app
azd deploy

# Full deployment
azd up
```

### Docker Deployment

```bash
docker build -t az-policy-lens:1.0.0 .
docker run -p 3001:3001 az-policy-lens:1.0.0
```

## Environment Variables

### Backend (.env)

```bash
NODE_ENV=development
PORT=3001
DATABASE_PATH=./data/policies.db
AUDIT_RETENTION_DAYS=1
DEFAULT_ADMIN_EMAIL=richard.van.berge.henegouwen@bam.com
```

### Frontend (.env.local)

```bash
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=Azure Policy Lens
```

## Troubleshooting

### Port Conflict

```bash
# Check what's using port 3001
lsof -i :3001

# Kill process using port
kill -9 <PID>
```

### Database Issues

```bash
# Remove database and rebuild
rm -rf ./data/policies.db*
npm run dev:backend
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
az-policy-lens/
├── frontend/               # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page containers
│   │   ├── hooks/         # Custom hooks
│   │   ├── api.ts         # API client
│   │   ├── store.ts       # Zustand state
│   │   ├── App.tsx        # App shell
│   │   └── main.tsx       # Entry point
│   └── package.json
├── backend/                # Node.js + Express
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── database/      # SQLite schema
│   │   ├── middleware/    # Express middleware
│   │   └── server.ts      # Express app
│   └── package.json
├── infra/                  # Azure Bicep
│   ├── main.bicep
│   └── app-service.bicep
├── scripts/                # PowerShell utilities
│   ├── Export-Policies.ps1
│   └── Export-All.ps1
├── .github/workflows/      # CI/CD
│   └── deploy.yml
├── azure.yaml              # azd config
└── README.md               # Project docs
```

## Key Features

- ✅ Multi-tab dashboard (Dashboard, Policies, Import, Users, Settings)
- ✅ Role-based access control (admin, superuser, user)
- ✅ Policy compliance tracking by framework
- ✅ CSV import/export
- ✅ Audit logging
- ✅ Application Insights integration
- ✅ Azure App Service deployment ready

## API Documentation

See [backend/README.md](./backend/README.md) for full API documentation.

## Support

For issues or questions:
- Check existing [GitHub Issues](https://github.com/rvanbergehenegouwen/az-policy-lens/issues)
- Create a new issue with reproduction steps
- Include logs from both frontend (browser console) and backend (terminal)

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit: `git commit -m "feat: description"`
4. Push: `git push -u origin feature/your-feature`
5. Open Pull Request on GitHub

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

**Happy coding!** 🚀
