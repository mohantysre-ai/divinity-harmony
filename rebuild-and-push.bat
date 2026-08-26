@echo off
setlocal EnableExtensions

REM Full rebuild: commit/push to GitHub, build + push Docker image, redeploy container.
REM Usage:
REM   rebuild-and-push.bat
REM   rebuild-and-push.bat --no-cache

cd /d "%~dp0"

set "IMAGE=smohanty010620/divinity-harmony:latest"
set "COMPOSE_FILE=%~dp0docker-compose.yml"
set "NO_CACHE="
set "SKIP_PUSH="

if /I "%~1"=="--no-cache" set "NO_CACHE=--no-cache"
if /I "%~1"=="/no-cache" set "NO_CACHE=--no-cache"

REM ---------------------------------------------------------------------------
echo.
echo === [1/4] Committing changes to GitHub ===
git add -A
set "GIT_DIRTY="
for /f %%i in ('git status --porcelain 2^>nul') do set "GIT_DIRTY=1"
if not defined GIT_DIRTY (
  echo Nothing to commit. Skipping GitHub commit/push.
) else (
  git commit -m "Rebuild: update Live Temple Darshan YouTube link and app changes"
  if errorlevel 1 (
    echo ERROR: git commit failed.
    exit /b 1
  )
  git push origin main
  if errorlevel 1 (
    echo WARN: git push failed. Continuing with Docker build...
  ) else (
    echo Pushed to GitHub: https://github.com/mohantysre-ai/divinity-harmony
  )
)

REM ---------------------------------------------------------------------------
echo.
echo === [2/4] Docker Hub login ===
docker login
if errorlevel 1 (
  echo WARN: docker login failed - will build and run locally without pushing to Hub.
  set "SKIP_PUSH=1"
)

REM ---------------------------------------------------------------------------
echo.
echo === [3/4] Building %IMAGE% %NO_CACHE% ===
docker compose -f "%COMPOSE_FILE%" build %NO_CACHE% web
if errorlevel 1 (
  echo ERROR: docker compose build failed.
  exit /b 1
)

echo.
echo === Verifying image exists locally ===
set "IMG_FOUND="
for /f %%i in ('docker images -q "%IMAGE%" 2^>nul') do set "IMG_FOUND=1"
if not defined IMG_FOUND (
  echo ERROR: Image %IMAGE% was not created by the build.
  exit /b 1
)

if not defined SKIP_PUSH (
  echo.
  echo === Pushing %IMAGE% ===
  docker push "%IMAGE%"
  if errorlevel 1 (
    echo WARN: docker push failed. Continuing with local redeploy...
  ) else (
    echo Pushed to Hub: https://hub.docker.com/r/smohanty010620/divinity-harmony
  )
) else (
  echo.
  echo Skipping Docker Hub push (not logged in).
)

REM ---------------------------------------------------------------------------
echo.
echo === [4/4] Redeploying local container ===
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
