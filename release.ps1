# Release Script for Pulse Server (PowerShell)
# Usage: .\release.ps1 -VersionType minor -PrereleaseId beta

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("major", "minor", "patch", "premajor", "preminor", "prepatch")]
    [string]$VersionType = "minor",

    [Parameter(Mandatory=$false)]
    [string]$PrereleaseId = "beta"
)

Write-Host "🚀 Pulse Server Release Tool" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Get current version from package.json
$packageJson = Get-Content package.json | ConvertFrom-Json
$currentVersion = $packageJson.version

Write-Host "📦 Current version: $currentVersion" -ForegroundColor Yellow

# Calculate new version
$versionParts = $currentVersion -split '\.'
$major = [int]$versionParts[0]
$minor = [int]$versionParts[1]
$patch = [int]$versionParts[2]

$newVersion = switch ($VersionType) {
    "major" { "$($major+1).0.0" }
    "minor" { "$major.$($minor+1).0" }
    "patch" { "$major.$minor.$($patch+1)" }
    "premajor" { "$($major+1).0.0-$PrereleaseId.1" }
    "preminor" { "$major.$($minor+1).0-$PrereleaseId.1" }
    "prepatch" { "$major.$minor.$($patch+1)-$PrereleaseId.1" }
}

Write-Host "📝 New version: $newVersion" -ForegroundColor Green

# Confirm
$confirmation = Read-Host "Continue with release? (y/n)"
if ($confirmation -ne 'y') {
    Write-Host "❌ Release cancelled" -ForegroundColor Red
    exit 1
}

# Update package.json
$packageJson.version = $newVersion
$packageJson | ConvertTo-Json | Set-Content package.json
Write-Host "✅ Version updated in package.json" -ForegroundColor Green

# Create git tag
Write-Host "🏷️ Creating git tag v$newVersion" -ForegroundColor Yellow
git tag -a "v$newVersion" -m "Release version $newVersion"

# Create git commit for version update
git add package.json
git commit -m "chore: bump version to $newVersion"

Write-Host ""
Write-Host "✅ Release prepared: v$newVersion" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update CHANGELOG.md with release notes"
Write-Host "  2. git push origin v$newVersion"
Write-Host "  3. Create GitHub Release with release notes"
Write-Host ""
