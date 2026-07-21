# Azure Policy Lens - Build and Deployment Configuration

## Prerequisites
- Node.js 20+
- npm 10+
- Azure CLI 2.50+
- Git 2.40+

## Quick Build

```bash
npm install
npm run build
```

## Production Build
```bash
docker build -t az-policy-lens:1.0.0 .
docker run -p 3001:3001 az-policy-lens:1.0.0
```

## Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_PATH: /app/data/policies.db
    volumes:
      - ./data:/app/data
```

Run with: `docker-compose up`

## Azure Deployment

### Prerequisites
1. Azure subscription
2. Resource group created
3. Azure CLI authenticated

### Bicep Deployment

```bash
# Set variables
RESOURCE_GROUP="az-policy-lens-rg"
LOCATION="eastus"
APP_NAME="az-policy-lens"

# Create resource group
az group create -n $RESOURCE_GROUP -l $LOCATION

# Deploy with Bicep
az deployment group create \
  -g $RESOURCE_GROUP \
  -f infra/main.bicep \
  --parameters \
    location=$LOCATION \
    env=dev \
    appName=$APP_NAME
```

### Using Azure Developer CLI (azd)

```bash
# Initialize
azd init

# Login
azd auth login

# Provision Azure resources
azd provision

# Deploy application
azd deploy

# Full workflow
azd up
```

## Post-Deployment

1. Get app URL:
```bash
az webapp show -g $RESOURCE_GROUP -n "az-policy-lens-app-dev" --query defaultHostName
```

2. Configure authentication in Azure AD if needed

3. Import policy data:
```bash
curl -X POST https://<app-url>/api/import/policies \
  -H "x-user-email: richard.van.berge.henegouwen@bam.com" \
  -F "file=@policies.csv"
```

## Environment Configuration

Set these in Azure App Service settings:
- `NODE_ENV`: production
- `AUDIT_RETENTION_DAYS`: 1
- `DEFAULT_ADMIN_EMAIL`: richard.van.berge.henegouwen@bam.com
