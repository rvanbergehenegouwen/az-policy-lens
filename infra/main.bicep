param location string = resourceGroup().location
param env string = 'dev'
param appName string = 'az-policy-lens'

module appService 'app-service.bicep' = {
  name: 'app-service-module'
  params: {
    location: location
    env: env
    appName: appName
  }
}

output appServiceId string = appService.outputs.appServiceId
output appServiceName string = appService.outputs.appServiceName
output appServiceUrl string = appService.outputs.appServiceUrl
