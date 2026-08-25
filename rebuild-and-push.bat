@echo off
setlocal EnableExtensions

REM Build, push, and redeploy Divinity Harmony Docker image.
REM Usage:
REM   rebuild-and-push.bat
REM   rebuild-and-push.bat --no-cache

cd /d "%~dp0"

set "IMAGE=smohanty010620/divinity-harmony:latest"
set "COMPOSE_FILE=%~dp0docker-compose.yml"
set "NO_CACHE="

if /I "%~1"=="--no-cache" set "NO_CACHE=--no-cache"
if /I "%~1"=="/no-cache" set "NO_CACHE=--no-cache"

echo.
echo === Docker Hub login check ===
docker login
if errorlevel 1 (
  echo ERROR: docker login failed.
  exit /b 1
)

echo.
echo === Building %IMAGE% %NO_CACHE% ===
docker compose -f "%COMPOSE_FILE%" build %NO_CACHE% web
if errorlevel 1 (
  echo ERROR: docker compose build failed.
  exit /b 1
)

echo.
echo === Verifying image exists locally ===
docker images "%IMAGE%" --format "{{.ID}}" | findstr . >nul
if errorlevel 1 (
  echo ERROR: Image %IMAGE% was not created by the build.
  exit /b 1
)

echo.
echo === Pushing %IMAGE% ===
docker push "%IMAGE%"
if errorlevel 1 (
  echo ERROR: docker push failed.
  exit /b 1
)

echo.
echo === Redeploying local container ===
REM Remove legacy container name if it still holds port 7800.
docker rm -f divinity-harmony >nul 2>&1
docker compose -f "%COMPOSE_FILE%" up -d --force-recreate --remove-orphans web
if errorlevel 1 (
  echo ERROR: failed to recreate local container.
  exit /b 1
)

echo.
echo === Done ===
docker images "%IMAGE%" --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedSince}}\t{{.Size}}"
echo.
docker compose -f "%COMPOSE_FILE%" ps web
echo.
echo Local: http://localhost:7800
echo Hub:   https://hub.docker.com/r/smohanty010620/divinity-harmony
echo Hard-refresh the browser ^(Ctrl+F5^) if the old UI is cached.
exit /b 0
