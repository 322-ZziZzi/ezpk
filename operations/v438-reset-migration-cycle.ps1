param(
  [switch]$ConfirmReset
)

$ErrorActionPreference = 'Stop'
if (-not $ConfirmReset) {
  throw 'Destructive operation blocked. Re-run with -ConfirmReset after reviewing the backup path and target database.'
}

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
$Stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$BackupDir = Join-Path $Root 'operations\backups'
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
$Backup = Join-Path $BackupDir "ezpk-members_before_v438_migration_reset_$Stamp.sql"

Write-Host '[1/5] Verifying target D1 database...'
npx wrangler d1 info ezpk-members

Write-Host '[2/5] Capturing pre-reset counts...'
npx wrangler d1 execute ezpk-members --remote --file=./operations/v438_migration_cycle_verify.sql

Write-Host "[3/5] Exporting full pre-reset backup -> $Backup"
npx wrangler d1 export ezpk-members --remote --output=$Backup --yes
if (-not (Test-Path -LiteralPath $Backup)) { throw 'Backup file was not created. Reset aborted.' }
if ((Get-Item -LiteralPath $Backup).Length -le 0) { throw 'Backup file is empty. Reset aborted.' }

Write-Host '[4/5] Resetting migration-cycle data...'
npx wrangler d1 execute ezpk-members --remote --file=./operations/v438_migration_cycle_reset.sql --yes

Write-Host '[5/5] Verifying post-reset counts...'
npx wrangler d1 execute ezpk-members --remote --file=./operations/v438_migration_cycle_verify.sql

Write-Host 'DONE. Expected: all migration-cycle counts = 0; migration_tier_settings_preserved = 4.'
Write-Host "Backup: $Backup"
