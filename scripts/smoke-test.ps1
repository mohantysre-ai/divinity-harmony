# Smoke-test Divinity Harmony after rebuild/redeploy.
# Usage:
#   powershell -File scripts/smoke-test.ps1
#   powershell -File scripts/smoke-test.ps1 -BaseUrl http://localhost:7800
# Exit code 0 = pass, 1 = fail.

param(
  [string]$BaseUrl = "http://localhost:7800",
  [int]$Retries = 12,
  [int]$DelaySeconds = 2
)

$ErrorActionPreference = "Stop"
$failed = @()

function Fail([string]$msg) {
  $script:failed += $msg
  Write-Host "FAIL: $msg" -ForegroundColor Red
}

function Pass([string]$msg) {
  Write-Host "PASS: $msg" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Smoke test: $BaseUrl ==="

$html = $null
for ($i = 1; $i -le $Retries; $i++) {
  try {
    $html = Invoke-WebRequest -Uri "$BaseUrl/" -UseBasicParsing -TimeoutSec 15
    if ($html.StatusCode -eq 200) { break }
  } catch {
    Write-Host "Waiting for app... attempt $i/$Retries"
    Start-Sleep -Seconds $DelaySeconds
  }
}

if (-not $html -or $html.StatusCode -ne 200) {
  Fail "Home page did not return HTTP 200"
  Write-Host ""
  Write-Host "SMOKE TEST FAILED ($($failed.Count) checks)" -ForegroundColor Red
  exit 1
}
Pass "Home page HTTP $($html.StatusCode)"

$cache = $html.Headers["Cache-Control"]
if ($cache -and ($cache -match "no-store|no-cache")) {
  Pass "HTML Cache-Control is revalidate ($cache)"
} else {
  Fail "HTML Cache-Control should be no-store/no-cache (got: $cache)"
}

if ($html.Content -notmatch 'index-[A-Za-z0-9_-]+\.js') {
  Fail "Home HTML missing hashed JS bundle"
  Write-Host ""
  Write-Host "SMOKE TEST FAILED ($($failed.Count) checks)" -ForegroundColor Red
  exit 1
}
$jsName = [regex]::Match($html.Content, 'index-[A-Za-z0-9_-]+\.js').Value
Pass "Found JS bundle $jsName"

try {
  $jsResp = Invoke-WebRequest -Uri "$BaseUrl/assets/$jsName" -UseBasicParsing -TimeoutSec 30
  if ($jsResp.StatusCode -ne 200) {
    Fail "JS bundle HTTP $($jsResp.StatusCode)"
  } else {
    Pass "JS bundle HTTP 200 (len=$($jsResp.RawContentLength))"
  }
  $js = $jsResp.Content
} catch {
  Fail "Could not download JS bundle: $($_.Exception.Message)"
  $js = ""
}

$checks = @(
  @{ Name = "Expanded catalog (Asato Ma)"; Pattern = "Asato Ma Sad Gamaya" },
  @{ Name = "Surya Namaskar entries"; Pattern = "Surya Namaskar Mantra 1" },
  @{ Name = "Gita entry"; Pattern = "Bhagavad Gita 18\.66" },
  @{ Name = "Device voice player"; Pattern = "Tap Play to hear this mantra" },
  @{ Name = "Verified Ganesha image"; Pattern = "commons/6/64/Ganesha" },
  @{ Name = "Verified Hanuman image"; Pattern = "commons/4/46/Hanuman" },
  @{ Name = "Goddess Gayatri image"; Pattern = "commons/b/b4/Gayatri1" },
  @{ Name = "Enriched Varuna translation"; Pattern = "clothed in waters" },
  @{ Name = "Live Darshan UI"; Pattern = "Live Temple Darshan" }
)

foreach ($check in $checks) {
  if ($js -and ($js -match $check.Pattern)) {
    Pass $check.Name
  } else {
    Fail $check.Name
  }
}

# Live streams are fetched at runtime from /api/live-darshan (not baked into the JS bundle).
try {
  $health = Invoke-RestMethod -Uri "$BaseUrl/api/live-darshan/health" -TimeoutSec 20
  if ($health.ok -eq $true) {
    Pass "Live Darshan API health"
  } else {
    Fail "Live Darshan API health (ok != true)"
  }
} catch {
  Fail "Live Darshan API health ($($_.Exception.Message))"
}

try {
  $feed = Invoke-RestMethod -Uri "$BaseUrl/api/live-darshan" -TimeoutSec 45
  $count = @($feed.items).Count
  if ($count -ge 30) {
    Pass "30+ Live Darshan streams ($count live)"
  } else {
    Fail "30+ Live Darshan streams (got $count)"
  }
} catch {
  Fail "30+ Live Darshan streams ($($_.Exception.Message))"
}

# Local catalog file check when present
$catalogPath = Join-Path $PSScriptRoot "..\src\data\mantras.json"
if (Test-Path $catalogPath) {
  $count = (Get-Content $catalogPath -Raw | ConvertFrom-Json).mantras.Count
  if ($count -ge 200) {
    Pass "Local mantras.json count = $count (>= 200)"
  } else {
    Fail "Local mantras.json count = $count (expected >= 200)"
  }
}

Write-Host ""
if ($failed.Count -eq 0) {
  Write-Host "SMOKE TEST PASSED" -ForegroundColor Green
  exit 0
}

Write-Host "SMOKE TEST FAILED ($($failed.Count) checks)" -ForegroundColor Red
$failed | ForEach-Object { Write-Host " - $_" }
exit 1
