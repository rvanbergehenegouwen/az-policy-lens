param location string = resourceGroup().location
param env string = 'dev'
param appName string = 'az-policy-lens'

var appServicePlanName = '${appName}-plan-${env}'
var appServiceName = '${appName}-app-${env}'
var storageAccountName = replace('${appName}${env}', '-', '')

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: env == 'prod' ? 'P1V2' : 'B2'
    capacity: env == 'prod' ? 3 : 1
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Storage Account for app files
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    accessTier: 'Hot'
    minimumTlsVersion: 'TLS1_2'
  }
}

// App Service
resource appService 'Microsoft.Web/sites@2023-01-01' = {
  name: appServiceName
  location: location
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'true'
        }
        {
          name: 'PORT'
          value: '3001'
        }
        {
          name: 'NODE_ENV'
          value: env == 'prod' ? 'production' : 'development'
        }
        {
          name: 'AUDIT_RETENTION_DAYS'
          value: '1'
        }
        {
          name: 'DEFAULT_ADMIN_EMAIL'
          value: 'richard.van.berge.henegouwen@bam.com'
        }
      ]
      alwaysOn: true
      http20Enabled: true
      minTlsVersion: '1.2'
    }
    httpsOnly: true
  }
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${appName}-insights-${env}'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    RetentionInDays: env == 'prod' ? 30 : 7
  }
}

// Connect App Insights to App Service
resource appServiceAppInsights 'Microsoft.Web/sites/config@2023-01-01' = {
  parent: appService
  name: 'appsettings'
  properties: {
    APPINSIGHTS_INSTRUMENTATIONKEY: appInsights.properties.InstrumentationKey
    APPLICATIONINSIGHTS_CONNECTION_STRING: 'InstrumentationKey=${appInsights.properties.InstrumentationKey}'
  }
}

output appServiceId string = appService.id
output appServiceName string = appService.name
output appServiceUrl string = 'https://${appService.properties.defaultHostName}'
