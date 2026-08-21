param([string]$DatabaseName = "ezpk-members")
$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SqlPath = Join-Path $ScriptDir "v440_rank_lifecycle_post_migration_verify.sql"
$OutDir = Join-Path $ScriptDir "v440_post_migration_reports"
$raw = Get-Content -LiteralPath $SqlPath -Raw
$withoutComments = [regex]::Replace($raw, "(?m)^\s*--.*$", "")
$statements = @($withoutComments -split ";" | ForEach-Object { $_.Trim() } | Where-Object { $_ })
if ($statements.Count -ne 12) { throw "Expected 12 SELECT statements, found $($statements.Count)." }
if (@($statements | Where-Object { $_ -notmatch "^(?is)SELECT\b" }).Count -gt 0) { throw "READ-ONLY guard failed." }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$stamp=Get-Date -Format "yyyyMMdd_HHmmss"
$log=Join-Path $OutDir "v440_post_migration_verify_$stamp.txt"
"EZPK v440 POST-MIGRATION READ-ONLY VERIFY" | Set-Content -LiteralPath $log -Encoding UTF8
for($i=0;$i -lt $statements.Count;$i++){
  $sql=[regex]::Replace($statements[$i],"\s+"," ").Trim()+";"
  Write-Host "[VERIFY $($i+1)/$($statements.Count)]"
  $old=$ErrorActionPreference;$ErrorActionPreference="Continue"
  try{
    & npx.cmd wrangler d1 execute $DatabaseName --remote ("--command="+$sql) 2>&1 | ForEach-Object { $line=$_.ToString(); Add-Content -LiteralPath $log -Value $line -Encoding UTF8; Write-Host $line }
    $exit=[int]$LASTEXITCODE
  } finally { $ErrorActionPreference=$old }
  if($exit -ne 0){throw "Verify query $($i+1) failed. Report: $log"}
}
Write-Host "POST-MIGRATION VERIFY COMPLETE 12/12"
Write-Host "Report: $log"
Write-Host "SHA-256: $((Get-FileHash -LiteralPath $log -Algorithm SHA256).Hash.ToLowerInvariant())"
