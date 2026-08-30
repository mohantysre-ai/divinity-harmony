# Ensure Docker Desktop engine is running (start it if needed).
# Usage: powershell -File scripts/ensure-docker.ps1
# Exit 0 = engine ready, 1 = failed / timed out

param(
  [int]$TimeoutSeconds = 120,
  [int]$PollSeconds = 2
)

$ErrorActionPreference = 'SilentlyContinue'

function Test-DockerEngine {
  docker info *> $null
  return $LASTEXITCODE -eq 0
}

if (Test-DockerEngine) {
  Write-Host 'Docker engine OK.'
  exit 0
}

$candidates = @(
  "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe",
  "${env:ProgramFiles(x86)}\Docker\Docker\Docker Desktop.exe",
  "$env:LOCALAPPDATA\Programs\Docker\Docker\Docker Desktop.exe"
)

$desktop = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $desktop) {
  Write-Host 'ERROR: Docker Desktop is not running and Docker Desktop.exe was not found.'
  Write-Host 'Install Docker Desktop from https://www.docker.com/products/docker-desktop/'
  exit 1
}

Write-Host "Docker engine not running. Starting Docker Desktop..."
Write-Host "  $desktop"
Start-Process -FilePath $desktop | Out-Null

$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
$attempt = 0
while ((Get-Date) -lt $deadline) {
  $attempt += 1
  Start-Sleep -Seconds $PollSeconds
  if (Test-DockerEngine) {
    $version = (docker version --format '{{.Server.Version}}' 2>$null)
    Write-Host "Docker engine ready after ~$($attempt * $PollSeconds)s (server $version)."
    exit 0
  }
  if ($attempt % 5 -eq 0) {
    Write-Host "Waiting for Docker engine... ($attempt checks, max ${TimeoutSeconds}s)"
  }
}

Write-Host "ERROR: Docker Desktop did not become ready within ${TimeoutSeconds}s."
Write-Host 'Open Docker Desktop manually and wait for Engine running, then retry.'
exit 1
