$ErrorActionPreference = "Stop"

$Db = "ezpk-members"
$SqlFile = Join-Path $PSScriptRoot "v442_rank_profile_post_migration_verify.sql"
$ReportDir = Join-Path $PSScriptRoot "v442_post_migration_reports"

New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null

$Stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$Report = Join-Path $ReportDir "v442_post_migration_verify_$Stamp.txt"

$Sql = [System.IO.File]::ReadAllText($SqlFile)
$Sql = [regex]::Replace($Sql, '(?m)^\s*--.*$', '')

$queries = @(
    $Sql -split ';' |
        ForEach-Object { $_.Trim() } |
        Where-Object { $_ -match '^SELECT\s' }
)

if ($queries.Count -ne 6) {
    throw "Expected exactly 6 read-only SELECT queries, found $($queries.Count)"
}

$i = 0

foreach ($q in $queries) {
    $i++

    "[VERIFY $i/$($queries.Count)]" |
        Tee-Object -FilePath $Report -Append

    & npx -y wrangler@4.125.0 d1 execute $Db --remote --command $q --json 2>&1 |
        Tee-Object -FilePath $Report -Append

    if ($LASTEXITCODE -ne 0) {
        throw "Verification query $i/$($queries.Count) failed."
    }
}

"POST-MIGRATION VERIFY COMPLETE $i/$($queries.Count)" |
    Tee-Object -FilePath $Report -Append

$sha = (Get-FileHash -LiteralPath $Report -Algorithm SHA256).Hash.ToLowerInvariant()

Write-Host "Report: $Report"
Write-Host "SHA-256: $sha"