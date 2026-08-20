param(
  [switch]$ConfirmRestore,
  [string]$Backup = "",
  [string]$Database = "ezpk-members"
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($Backup)) {
  $Backup = Get-ChildItem (Join-Path $PSScriptRoot 'backups') -Filter 'ezpk-members_before_v439_migration_reset_*.sql' -File |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName
}
if (-not $Backup -or -not (Test-Path -LiteralPath $Backup)) { throw "Pre-delete backup not found." }
$Out = Join-Path $PSScriptRoot 'member_restore_generated'
New-Item -ItemType Directory -Force -Path $Out | Out-Null

Write-Host '[1/6] Building selective restore SQL from pre-delete backup...'
& node (Join-Path $PSScriptRoot 'v439-build-member-restore.mjs') --backup $Backup --out $Out
if ($LASTEXITCODE -ne 0) { throw "Restore builder failed with exit code ${LASTEXITCODE}." }
$RestoreSql = Join-Path $Out 'restore_batman_eagle_64_99.sql'
$Preflight = (Get-Content -LiteralPath (Join-Path $Out 'preflight.sql.txt') -Raw).Trim()
$Verify = (Get-Content -LiteralPath (Join-Path $Out 'verify.sql.txt') -Raw).Trim()

Write-Host '[2/6] Checking current remote DB for ID/login/nickname conflicts...'
$Raw = & npx wrangler d1 execute $Database --remote --command $Preflight --yes --json
if ($LASTEXITCODE -ne 0) { throw "Remote preflight failed with exit code ${LASTEXITCODE}." }
try { $J = $Raw | ConvertFrom-Json } catch { throw 'Could not parse Wrangler JSON preflight output.' }
$Rows = @()
foreach ($item in @($J)) { if ($null -ne $item.results) { $Rows += @($item.results) } }
if ($Rows.Count -gt 0) {
  Write-Host 'Conflict rows already exist:'
  $Rows | Select-Object id,login_id,nickname,status | Format-Table -AutoSize
  throw 'Restore aborted: current DB already contains a conflicting member ID/login/nickname.'
}
Write-Host 'Preflight conflict check: PASS (0 rows)'

Write-Host '[3/6] Exporting current remote DB safety backup...'
$BackupDir = Join-Path $PSScriptRoot 'backups'
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
$Stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$BeforeRestore = Join-Path $BackupDir "ezpk-members_before_batman_eagle_restore_$Stamp.sql"
& npx wrangler d1 export $Database --remote --output $BeforeRestore --skip-confirmation
if ($LASTEXITCODE -ne 0) { throw "Current DB export failed with exit code ${LASTEXITCODE}." }
if (-not (Test-Path -LiteralPath $BeforeRestore)) { throw 'Safety backup file was not created.' }
$Hash=(Get-FileHash -LiteralPath $BeforeRestore -Algorithm SHA256).Hash.ToLowerInvariant()
Write-Host "Safety backup: $BeforeRestore"
Write-Host "Safety backup SHA-256: $Hash"

if (-not $ConfirmRestore) {
  Write-Host '[4/6] DRY RUN COMPLETE. No DB changes made.'
  Write-Host 'Review summary:'
  Get-Content -LiteralPath (Join-Path $Out 'summary.txt')
  Write-Host ''
  Write-Host 'To execute the restore, rerun with -ConfirmRestore.'
  exit 0
}

Write-Host '[4/6] Restoring Batman(64) and EAGLE(99) to remote D1...'
& npx wrangler d1 execute $Database --remote --file $RestoreSql --yes
if ($LASTEXITCODE -ne 0) { throw "Restore SQL failed with exit code ${LASTEXITCODE}. D1 should roll the failed file execution back." }

Write-Host '[5/6] Verifying restored member rows...'
$Raw2 = & npx wrangler d1 execute $Database --remote --command $Verify --yes --json
if ($LASTEXITCODE -ne 0) { throw "Post-restore verification failed with exit code ${LASTEXITCODE}." }
try { $J2 = $Raw2 | ConvertFrom-Json } catch { throw 'Could not parse Wrangler JSON verification output.' }
$Rows2 = @()
foreach ($item in @($J2)) { if ($null -ne $item.results) { $Rows2 += @($item.results) } }
$Restored = @($Rows2 | Where-Object { $_.id -eq 64 -or $_.id -eq 99 })
if ($Restored.Count -ne 2) {
  $Rows2 | Format-Table -AutoSize
  throw "Verification failed: expected 2 restored members, found $($Restored.Count)."
}
$Restored | Select-Object id,nickname,power,industry_level,member_rank,role,status,approval_status,admin_level | Format-Table -AutoSize

Write-Host '[6/6] DONE.'
Write-Host 'Batman member_id=64 restored.'
Write-Host 'EAGLE member_id=99 restored.'
Write-Host 'Old sessions were intentionally not restored; fresh login sessions are required.'
Write-Host "Rollback safety backup: $BeforeRestore"
Write-Host "Rollback backup SHA-256: $Hash"
