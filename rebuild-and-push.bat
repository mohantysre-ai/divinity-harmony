@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Full pipeline: optional git commit/push -> Docker build -> Hub push -> redeploy -> smoke test
REM Usage:
REM   rebuild-and-push.bat
REM   rebuild-and-push.bat --no-cache
REM   rebuild-and-push.bat --skip-git
REM   rebuild-and-push.bat --message "feat: expand mantras"

cd /d "%~dp0"

set "IMAGE=smohanty010620/divinity-harmony:latest"
set "COMPOSE_FILE=%~dp0docker-compose.yml"
set "NO_CACHE="
set "SKIP_PUSH="
set "SKIP_GIT="
set "COMMIT_MSG=chore: rebuild and deploy divinity-harmony"
if defined COMMIT_MSG_ENV set "COMMIT_MSG=%COMMIT_MSG_ENV%"

:parse_args
if "%~1"=="" goto args_done
if /I "%~1"=="--no-cache" set "NO_CACHE=--no-cache" & shift & goto parse_args
if /I "%~1"=="/no-cache" set "NO_CACHE=--no-cache" & shift & goto parse_args
if /I "%~1"=="--skip-git" set "SKIP_GIT=1" & shift & goto parse_args
if /I "%~1"=="--message" (
  if "%~2"=="" (
    echo ERROR: --message requires a value
    exit /b 1
  )
  set "COMMIT_MSG=%~2"
  shift
  shift
  goto parse_args
)
echo Unknown argument: %~1
exit /b 1
:args_done

REM ---------------------------------------------------------------------------
if defined SKIP_GIT (
  echo.
  echo === [1/6] Skipping Git commit/push ^(--skip-git^) ===
) else (
  echo.
  echo === [1/6] Committing changes to GitHub ===
  git add -A
  set "GIT_DIRTY="
  for /f "delims=" %%i in ('git status --porcelain 2^>nul') do set "GIT_DIRTY=1"
  if not defined GIT_DIRTY (
    echo Nothing to commit. Skipping GitHub commit/push.
  ) else (
    git commit -m "!COMMIT_MSG!"
    if errorlevel 1 (
      echo ERROR: git commit failed.
      exit /b 1
    )
    git push origin HEAD
    if errorlevel 1 (
      echo WARN: git push failed. Continuing with Docker build...
    ) else (
      echo Pushed to GitHub: https://github.com/mohantysre-ai/divinity-harmony
    )
  )
)

REM ---------------------------------------------------------------------------
echo.
echo === [2/6] Docker daemon check ===
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\ensure-docker.ps1"
if errorlevel 1 (
  echo ERROR: Docker engine is not available.
  exit /b 1
)

echo.
echo === [3/6] Docker Hub login ===
docker login
if errorlevel 1 (
  echo WARN: docker login failed - will build and run locally without pushing to Hub.
  set "SKIP_PUSH=1"
)

REM ---------------------------------------------------------------------------
echo.
echo === [4/6] Building %IMAGE% %NO_CACHE% ===
docker compose -f "%COMPOSE_FILE%" build %NO_CACHE% web
if errorlevel 1 (
  echo ERROR: docker compose build failed.
  exit /b 1
)

echo.
echo === Verifying image exists locally ===
docker image inspect "%IMAGE%" >nul 2>&1
if errorlevel 1 (
  echo ERROR: Image %IMAGE% was not created by the build.
  exit /b 1
)
echo Image OK.

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
  echo Skipping Docker Hub push ^(not logged in^).
)

REM ---------------------------------------------------------------------------
echo.
echo === [5/6] Redeploying local container ===
docker rm -f divinity-harmony >nul 2>&1
docker compose -f "%COMPOSE_FILE%" up -d --force-recreate --remove-orphans web
if errorlevel 1 (
  echo ERROR: failed to recreate local container.
  exit /b 1
)

REM ---------------------------------------------------------------------------
echo.
echo === [6/6] Smoke testing http://localhost:7800 ===
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\smoke-test.ps1" -BaseUrl "http://localhost:7800"
if errorlevel 1 (
  echo ERROR: smoke test failed. Container is up but checks did not pass.
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
