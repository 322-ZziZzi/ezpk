param(
  [switch]$ConfirmRestore,
  [string]$Backup = "",
  [string]$Database = "ezpk-members"
)
$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($Backup)) {
  $Backup = Get-ChildItem (Join-Path $PSScriptRoot 'backups') -Filter 'ezpk-members_before_v439_migration_reset_*.sql' -File |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName
}
if (-not $Backup -or -not (Test-Path -LiteralPath $Backup)) { throw "Pre-delete backup not found." }
$Out = Join-Path $PSScriptRoot 'member_restore_generated'
New-Item -ItemType Directory -Force -Path $Out | Out-Null

Write-Host '[1/7] Reading authoritative EAGLE update audit from current remote DB...'
$AuditSql = "SELECT id,actor_member_id,action,target_id,target_name,before_data,after_data,created_at FROM admin_activity_logs WHERE category='member' AND action='member_update' AND target_id='99' AND lower(target_name)='eagle' AND datetime(created_at)<datetime('2026-08-20 14:12:11') ORDER BY datetime(created_at) DESC,id DESC LIMIT 1;"
$AuditRaw = & npx wrangler d1 execute $Database --remote --command $AuditSql --yes --json
if ($LASTEXITCODE -ne 0) { throw "EAGLE audit query failed with exit code ${LASTEXITCODE}." }
try { $AuditJ = $AuditRaw | ConvertFrom-Json } catch { throw 'Could not parse Wrangler JSON audit output.' }
$AuditRows = @()
foreach ($item in @($AuditJ)) { if ($null -ne $item.results) { $AuditRows += @($item.results) } }
if ($AuditRows.Count -ne 1) { throw "Expected exactly one EAGLE update audit row, found $($AuditRows.Count)." }
$Audit = $AuditRows[0]
try { $Before = $Audit.before_data | ConvertFrom-Json; $After = $Audit.after_data | ConvertFrom-Json } catch { throw 'EAGLE audit before_data/after_data JSON is invalid.' }
if ([string]$Before.nickname -ine 'Zeusgoeswild' -or [string]$After.nickname -ine 'EAGLE') { throw "EAGLE audit chain mismatch: '$($Before.nickname)' -> '$($After.nickname)'" }
Write-Host "Audit chain PASS: member_id 99 $($Before.nickname) -> $($After.nickname) at $($Audit.created_at)"
$AuditFile = Join-Path $Out 'eagle_update_audit.json'
$AuditJson = $Audit | ConvertTo-Json -Depth 8
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($AuditFile, $AuditJson, $Utf8NoBom)

Write-Host '[2/7] Building selective restore SQL from pre-delete backup...'
& node (Join-Path $PSScriptRoot 'v439-build-member-restore.mjs') --backup $Backup --eagle-audit $AuditFile --out $Out
if ($LASTEXITCODE -ne 0) { throw "Restore builder failed with exit code ${LASTEXITCODE}." }
$RestoreSql = Join-Path $Out 'restore_batman_eagle_64_99.sql'
$Preflight = (Get-Content -LiteralPath (Join-Path $Out 'preflight.sql.txt') -Raw).Trim()
$Verify = (Get-Content -LiteralPath (Join-Path $Out 'verify.sql.txt') -Raw).Trim()

Write-Host '[3/7] Checking current remote DB for ID/login/final-nickname conflicts...'
$Raw = & npx wrangler d1 execute $Database --remote --command $Preflight --yes --json
if ($LASTEXITCODE -ne 0) { throw "Remote preflight failed with exit code ${LASTEXITCODE}." }
try { $J = $Raw | ConvertFrom-Json } catch { throw 'Could not parse Wrangler JSON preflight output.' }
$Rows = @(); foreach ($item in @($J)) { if ($null -ne $item.results) { $Rows += @($item.results) } }
if ($Rows.Count -gt 0) { Write-Host 'Conflict rows already exist:'; $Rows | Select-Object id,login_id,nickname,status | Format-Table -AutoSize; throw 'Restore aborted: current DB already contains a conflicting member ID/login/final nickname.' }
Write-Host 'Preflight conflict check: PASS (0 rows)'

Write-Host '[4/7] Exporting current remote DB safety backup...'
$BackupDir = Join-Path $PSScriptRoot 'backups'; New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
$Stamp = Get-Date -Format 'yyyyMMdd_HHmmss'; $BeforeRestore = Join-Path $BackupDir "ezpk-members_before_batman_eagle_restore_$Stamp.sql"
& npx wrangler d1 export $Database --remote --output $BeforeRestore --skip-confirmation
if ($LASTEXITCODE -ne 0) { throw "Current DB export failed with exit code ${LASTEXITCODE}." }
if (-not (Test-Path -LiteralPath $BeforeRestore)) { throw 'Safety backup file was not created.' }
$Hash=(Get-FileHash -LiteralPath $BeforeRestore -Algorithm SHA256).Hash.ToLowerInvariant(); Write-Host "Safety backup: $BeforeRestore"; Write-Host "Safety backup SHA-256: $Hash"

if (-not $ConfirmRestore) {
  Write-Host '[5/7] DRY RUN COMPLETE. No DB changes made.'
  Get-Content -LiteralPath (Join-Path $Out 'summary.txt')
  Write-Host ''; Write-Host 'To execute the restore, rerun with -ConfirmRestore.'; exit 0
}

Write-Host '[5/7] Restoring Batman(64) and EAGLE(99) to remote D1...'
& npx wrangler d1 execute $Database --remote --file $RestoreSql --yes
if ($LASTEXITCODE -ne 0) { throw "Restore SQL failed with exit code ${LASTEXITCODE}. D1 should roll the failed file execution back." }

Write-Host '[6/7] Verifying restored member rows...'
$Raw2 = & npx wrangler d1 execute $Database --remote --command $Verify --yes --json
if ($LASTEXITCODE -ne 0) { throw "Post-restore verification failed with exit code ${LASTEXITCODE}." }
try { $J2 = $Raw2 | ConvertFrom-Json } catch { throw 'Could not parse Wrangler JSON verification output.' }
$Rows2 = @(); foreach ($item in @($J2)) { if ($null -ne $item.results) { $Rows2 += @($item.results) } }
$Restored = @($Rows2 | Where-Object { $_.id -eq 64 -or $_.id -eq 99 })
if ($Restored.Count -ne 2) { $Rows2 | Format-Table -AutoSize; throw "Verification failed: expected 2 restored members, found $($Restored.Count)." }
$B = @($Restored | Where-Object { $_.id -eq 64 -and $_.nickname -ieq 'Batman' }); $E = @($Restored | Where-Object { $_.id -eq 99 -and $_.nickname -ieq 'EAGLE' })
if ($B.Count -ne 1 -or $E.Count -ne 1) { $Restored | Format-Table -AutoSize; throw 'Verification failed: final nicknames are not Batman/EAGLE.' }
$Restored | Select-Object id,nickname,power,industry_level,member_rank,role,status,approval_status,admin_level | Format-Table -AutoSize

Write-Host '[7/7] DONE.'
Write-Host 'Batman member_id=64 restored.'
Write-Host 'EAGLE member_id=99 restored from Zeusgoeswild backup identity + EAGLE update audit.'
Write-Host 'Old sessions were intentionally not restored; fresh login sessions are required.'
Write-Host "Rollback safety backup: $BeforeRestore"
Write-Host "Rollback backup SHA-256: $Hash"
