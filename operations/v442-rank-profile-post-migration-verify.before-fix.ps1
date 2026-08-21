$ErrorActionPreference = "Stop"
$Db = "ezpk-members"
$SqlFile = Join-Path $PSScriptRoot "v442_rank_profile_post_migration_verify.sql"
$ReportDir = Join-Path $PSScriptRoot "v442_post_migration_reports"
New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null
$Stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$Report = Join-Path $ReportDir "v442_post_migration_verify_$Stamp.txt"
$queries = (Get-Content -LiteralPath $SqlFile -Raw) -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ -match '^SELECT' }
$i=0
foreach($q in $queries){
  $i++
  "[VERIFY $i/$($queries.Count)]" | Tee-Object -FilePath $Report -Append
  npx wrangler d1 execute $Db --remote --command $q --json 2>&1 | Tee-Object -FilePath $Report -Append
}
"POST-MIGRATION VERIFY COMPLETE $i/$($queries.Count)" | Tee-Object -FilePath $Report -Append
$sha=(Get-FileHash -LiteralPath $Report -Algorithm SHA256).Hash.ToLowerInvariant()
"Report: $Report"
"SHA-256: $sha"
