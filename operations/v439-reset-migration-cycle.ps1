param(
  [switch]$ConfirmReset
)

$ErrorActionPreference = 'Stop'

if (-not $ConfirmReset) {
  throw 'Destructive operation blocked. Re-run with -ConfirmReset after reviewing the target database and backup path.'
}

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$Stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$BackupDir = Join-Path $Root 'operations\backups'
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
$Backup = Join-Path $BackupDir "ezpk-members_before_v439_migration_reset_$Stamp.sql"

function Invoke-Wrangler {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  & npx.cmd wrangler @Arguments
  $ExitCode = $LASTEXITCODE
  if ($ExitCode -ne 0) {
    throw "Wrangler command failed with exit code ${ExitCode}: npx wrangler $($Arguments -join ' ')"
  }
}

Write-Host '[1/5] Verifying target D1 database...'
Invoke-Wrangler -Arguments @('d1','info','ezpk-members')

Write-Host '[2/5] Capturing pre-reset counts...'
Invoke-Wrangler -Arguments @(
  'd1','execute','ezpk-members','--remote',
  '--file=./operations/v439_migration_cycle_verify.sql',
  '--yes'
)

Write-Host "[3/5] Exporting full pre-reset backup -> $Backup"
Invoke-Wrangler -Arguments @(
  'd1','export','ezpk-members','--remote',
  "--output=$Backup",
  '--skip-confirmation'
)

if (-not (Test-Path -LiteralPath $Backup)) {
  throw 'Backup file was not created. Reset aborted.'
}

$BackupInfo = Get-Item -LiteralPath $Backup
if ($BackupInfo.Length -le 0) {
  throw 'Backup file is empty. Reset aborted.'
}

$BackupHash = (Get-FileHash -LiteralPath $Backup -Algorithm SHA256).Hash.ToLowerInvariant()
Write-Host "Backup verified: $($BackupInfo.Length) bytes"
Write-Host "Backup SHA-256: $BackupHash"

Write-Host '[4/5] Resetting migration-cycle data...'
Invoke-Wrangler -Arguments @(
  'd1','execute','ezpk-members','--remote',
  '--file=./operations/v439_migration_cycle_reset.sql',
  '--yes'
)

Write-Host '[5/5] Verifying post-reset counts...'
Invoke-Wrangler -Arguments @(
  'd1','execute','ezpk-members','--remote',
  '--file=./operations/v439_migration_cycle_verify.sql',
  '--yes'
)

Write-Host ''
Write-Host 'DONE.'
Write-Host 'Expected after reset:'
Write-Host '  migration_applications = 0'
Write-Host '  migration_import_batches = 0'
Write-Host '  migration_rate_limits = 0'
Write-Host '  migration_inquiry_sessions = 0'
Write-Host '  migration_inquiries = 0'
Write-Host '  migration_inquiry_replies = 0'
Write-Host '  migration_related_admin_logs = 0'
Write-Host '  migration_tier_settings_preserved = 4'
Write-Host "Backup: $Backup"
Write-Host "Backup SHA-256: $BackupHash"
