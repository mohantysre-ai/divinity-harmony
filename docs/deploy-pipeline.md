# Deploy pipeline

## Local (required after every app change)

```bat
rebuild-and-push.bat
```

This runs:

1. Git commit + push (skip with `--skip-git`)
2. Docker Hub login
3. Image build (`smohanty010620/divinity-harmony:latest`)
4. Docker Hub push
5. Local container recreate on port `7800`
6. Smoke tests (`scripts/smoke-test.ps1`) — **must pass**

Custom commit message from PowerShell:

```powershell
$env:COMMIT_MSG_ENV = "feat: your change"
cmd /c rebuild-and-push.bat
```

Smoke test only:

```powershell
powershell -File scripts/smoke-test.ps1
powershell -File scripts/smoke-test.ps1 -BaseUrl https://mantra.sigq.in
```

## GitHub Actions (on every push to `main`)

Workflow: `.github/workflows/docker-build-push.yml`

Add these repository secrets (GitHub → Settings → Secrets and variables → Actions):

| Secret | Value |
|--------|--------|
| `DOCKERHUB_USERNAME` | `smohanty010620` |
| `DOCKERHUB_TOKEN` | Docker Hub access token (Account Settings → Security → New Access Token) |

Then every push to `main` builds, pushes `:latest` + `:<sha>`, and smoke-tests the image in CI.
