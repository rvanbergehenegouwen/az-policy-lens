# Azure Deployment Status & Next Steps

## ✅ Completed

- [x] GitHub repository created: https://github.com/rvanbergehenegouwen/az-policy-lens
- [x] All code pushed to `main` branch
- [x] Project fully scaffolded with React + Express + TypeScript
- [x] Azure resource group created: `az-policy-lens-rg`
- [x] Bicep infrastructure templates ready: `infra/main.bicep`

## ⚠️ Azure Quota Limitation

Your Azure subscription has **zero quota** for App Service Plans. This needs to be increased by Azure Support.

### Current Status
```
Subscription: a07fd4e9-6cd2-4327-9c8d-8beb8f83990d
Current App Service Quota: 0 (needs at least 1)
```

## 📋 Request Quota Increase

Follow these steps to request additional quota:

### Option 1: Azure Portal (Recommended)
1. Go to Azure Portal: https://portal.azure.com
2. Search for "Quotas"
3. Select **All services quota** or **Compute quota**
4. Find "App Service Plan" or "Total Regional Cores"
5. Request increase to at least 1
6. Submit request and wait for approval (usually 1-2 hours)

### Option 2: Azure CLI
```bash
az support tickets create \
  --subscription-id "a07fd4e9-6cd2-4327-9c8d-8beb8f83990d" \
  --title "Request: Increase App Service Plan quota" \
  --description "Need quota for App Service Plan for az-policy-lens application" \
  --severity "minimal"
```

## 🚀 Deployment Options After Quota Approval

### Once quota is approved:

```bash
# Set subscription
az account set --subscription "a07fd4e9-6cd2-4327-9c8d-8beb8f83990d"

# Create resource group
az group create --name az-policy-lens-rg --location eastus

# Deploy infrastructure
az deployment group create \
  --resource-group az-policy-lens-rg \
  --template-file infra/main.bicep \
  --parameters env=dev appName=az-policy-lens location=eastus

# Build application
npm run build

# Deploy to App Service
az webapp deployment source config-zip \
  --resource-group az-policy-lens-rg \
  --name az-policy-lens-app-dev \
  --src build.zip
```

## 🔄 Alternative: Azure Container Apps (No Quota Needed)

If you want to deploy immediately without waiting for quota approval, you can use **Azure Container Apps**:

```bash
# Create Container Apps environment
az containerapp env create \
  --name az-policy-lens-env \
  --resource-group az-policy-lens-rg \
  --location eastus

# Deploy container app
az containerapp create \
  --name az-policy-lens-app \
  --resource-group az-policy-lens-rg \
  --environment az-policy-lens-env \
  --image ghcr.io/rvanbergehenegouwen/az-policy-lens:latest \
  --target-port 3001 \
  --ingress 'external' \
  --query properties.configuration.ingress.fqdn
```

## 📦 Alternative: GitHub Pages Static Hosting

Deploy the frontend to GitHub Pages for free:

```bash
# Build frontend only
cd frontend
npm run build

# Deploy to GitHub Pages
gh-pages -d dist
```

Frontend will be available at: https://rvanbergehenegouwen.github.io/az-policy-lens

## 🔔 Next Steps

1. **Request quota increase** (5 minutes) → Wait for approval (1-2 hours)
2. **Deploy to App Service** (10 minutes)
3. **Configure authentication** (5 minutes)
4. **Import compliance data** (2 minutes)

---

## Current Resources Created

✅ Resource Group: `az-policy-lens-rg`  
✅ GitHub Repository: `rvanbergehenegouwen/az-policy-lens`  
⏳ App Service Plan: Pending quota approval  
⏳ App Service: Pending quota approval  

---

**Status Update**: Waiting for Azure quota approval. You can proceed with:
- Code development locally (`npm run dev`)
- Pushing additional features to GitHub
- Setting up GitHub Actions CI/CD
- Deploying frontend to GitHub Pages

Once quota is approved, full deployment to App Service can proceed immediately.
