param({
    [string]$SubscriptionId = 'a07fd4e9-6cd2-4327-9c8d-8beb8f83990d',
    [string]$ResourceGroupName = 'az-policy-lens-rg',
    [string]$OutputPath = './data'
})

Write-Host "Exporting all Azure Policy data..." -ForegroundColor Green

# Create output directory
if (-not (Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

# Export policies
Write-Host "Exporting policies..." -ForegroundColor Cyan
& .\Export-Policies.ps1 -SubscriptionId $SubscriptionId -OutputPath "$OutputPath/policies.csv"

Write-Host ""
Write-Host "✓ All exports completed!" -ForegroundColor Green
Write-Host "Output directory: $OutputPath" -ForegroundColor Cyan
