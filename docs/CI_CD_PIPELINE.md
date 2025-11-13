# CI/CD Pipeline Documentation

## Overview

Pulse Server uses **Drone CI** for continuous integration and deployment with a build-and-copy approach and PM2 for process management.

## Pipeline Architecture

### 1. **PR Lint Pipeline** (`.drone-pr-lint.yml`)

**Triggers:** Pull Request created/updated

**Purpose:** Validates that PR titles and commits follow conventional commits format

**Steps:**

1. Install dependencies
2. Lint PR title against commitlint rules
3. Lint all commits in the PR
4. Notify on failure

**Requirements:**

- PR title must follow: `type(scope): description`
- All commits must follow conventional commits format
- Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `revert`

---

### 2. **Test Pipeline** (`.drone.yml` - test)

**Triggers:** Pull Request created/updated

**Purpose:** Run automated tests to validate changes

**Steps:**

1. Install dependencies (`npm ci`)
2. Run Jest tests (`npm test`)
3. Lint commit messages

**Success Criteria:**
Pulse Server uses **GitHub Actions** for continuous integration and deployment with a build-and-copy approach and PM2 for process management.

- All tests pass (11/11)
- No linting errors
- Build succeeds

---

**Triggers:** Pull Request created/updated

### 3. **Build and Deploy Pipeline** (`.drone.yml` - build-and-deploy)

**Purpose:** Validates that PR titles and commits follow conventional commits format
**Triggers:**

- Push to `main` or `develop` branch
- Tag creation (e.g., `v1.2.3`)

### 2. **Test Workflow** (`.github/workflows/test-on-pr.yml`)

**Triggers:** Pull Request created/updated

#### Build Phase

### 3. **Build and Deploy Workflow** (`.github/workflows/build-and-deploy.yml`)

2. **Run Tests** - Ensure all tests pass before deployment
   **Triggers:**

- Tag creation (e.g., `v1.2.3`)

4. **Copy to Server** - SCP files to `/var/www/pulse-server`
5. **Install Production Deps** - `npm ci --only=production` on server
6. **Health Check (Before)** - Check current application status
7. **Deploy with PM2** - Reload or start app using `ecosystem.config.js`
8. **Health Check (After)** - Verify deployment success
   - Check PM2 process status
   - Review logs (last 20 lines)
   - Health endpoint test (`curl http://localhost:3000/health`)

#### Notification Phase

4. **Copy to Server** - rsync files to `/var/www/pulse-server` via SSH

5. **Notify Success/Failure** - Send Telegram notification

**Files Deployed:**

```
server.js
package.json
package-lock.json
.env.production
ecosystem.config.js
routes/**
middleware/**
services/**
### 4. **Auto-Release Workflow** (`.github/workflows/auto-release.yml`)
```

## **Triggers:** Push to `main` branch (after PR merge)

### 4. **Auto-Release Pipeline** (`.drone-release.yml`)

### 5. **Release Workflow** (`.github/workflows/release.yml`)

**Triggers:** Push to `main` branch (after PR merge)
**Triggers:** Tag push (e.g., `git push --tags`)
**Purpose:** Automatically create semantic version releases

**Steps:**

## Required Secrets

1. **Check for Release** - Analyze commits since last tag
   Configure these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):
   - Look for `feat:`, `fix:`, `perf:`, `revert:`, or `BREAKING CHANGE:`
   - Skip if only `docs:`, `chore:`, `style:` commits

```
DEPLOY_HOST          # Server hostname/IP
DROPLET_USER         # SSH username
SSH_PRIVATE_KEY      # SSH private key
```

- Create git tag
- Push changes and tags

```
GITHUB_TOKEN         # GitHub personal access token
```

**Version Bumping Rules:**

```
TELEGRAM_TOKEN       # Telegram bot token
TELEGRAM_CHAT_ID     # Telegram chat ID for notifications
```

---

### 5. **Release Pipeline** (`.drone.yml` - release)

### Auto-release workflow uses GITHUB_TOKEN and SSH_PRIVATE_KEY for pushing tags and releases.

**Steps:**

1. Create GitHub release with tag
2. Attach `CHANGELOG.md` and `package.json`
3. Notify via Telegram

---

## PM2 Configuration

**File:** `ecosystem.config.js`

### Key Features:

**Cluster Mode:**

- 2 instances by default
- Load balancing across CPU cores
- Zero-downtime reloads

**Health Monitoring:**

- Health check every 30 seconds at `/health`
- Auto-restart on failure (max 10 restarts)
- Max memory restart at 500MB

**Logging:**

- JSON format logs
- Error logs: `./logs/error.log`
- Output logs: `./logs/out.log`
- Merged and timestamped

**Graceful Shutdown:**

- 5-second kill timeout
- Wait for ready signal
- 10-second listen timeout

**Deployment Environments:**

- **Production:** `main` branch → `/var/www/pulse-server`
- **Staging:** `develop` branch → `/var/www/pulse-server-staging`

---

## Required Secrets

Configure these secrets in your Drone CI settings:

### Deployment Secrets

```
deploy_host          # Server hostname/IP
deploy_username      # SSH username
deploy_ssh_key       # SSH private key
```

### GitHub Integration

```
github_token         # GitHub personal access token
```

### Notifications

```
telegram_token       # Telegram bot token
telegram_chat_id     # Telegram chat ID for notifications
```

### Drone Integration (for auto-release)

```
drone_server         # Drone server URL
drone_token          # Drone API token
```

---

## Workflow Examples

### 1. Feature Development Flow

```bash
# Create feature branch
git checkout -b feat/new-api-endpoint

# Make changes and commit using conventional commits
npm run commit
# Select: feat
# Scope: api
# Description: add user profile endpoint

# Push and create PR
git push origin feat/new-api-endpoint
```

**What Happens:**

1. ✅ PR Lint checks title and commits
2. ✅ Test pipeline runs all tests
3. 👀 Wait for review
4. ✅ Merge to main
5. 🚀 Auto-release creates v1.1.0
6. 🌐 Deployment to production

---

### 2. Hotfix Flow

```bash
# Create hotfix branch
git checkout -b fix/critical-bug

# Make fix and commit
npm run commit
# Select: fix
# Scope: security
# Description: patch XSS vulnerability

# Push and create PR
git push origin fix/critical-bug
```

**What Happens:**

1. ✅ PR Lint validates format
2. ✅ Tests run
3. ✅ Merge to main
4. 🚀 Auto-release creates v1.0.1 (patch)
5. 🌐 Immediate deployment

---

### 3. Manual Release Flow

```bash
# For major version bump
npm run release:major

# For minor version bump
npm run release:minor

# For patch version bump
npm run release:patch

# For beta release
npm run release:beta

# Push tags
git push --follow-tags
```

**What Happens:**

1. 📦 Version bumped in package.json
2. 📝 CHANGELOG.md updated
3. 🏷️ Git tag created
4. 🚀 Release pipeline triggered
5. 🌐 Deployment to production

---

## Health Checks

### Endpoint Requirements

Your application must implement a `/health` endpoint:

```javascript
// server.js
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
  });
});
```

### PM2 Health Check

PM2 will check `/health` every 30 seconds:

- ✅ Status 200 → Healthy
- ❌ Non-200 or timeout → Restart

---

## Deployment Commands

### PM2 Commands

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Reload without downtime
pm2 reload ecosystem.config.js --env production

# Restart all instances
pm2 restart pulse-server

# Stop application
pm2 stop pulse-server

# View logs
pm2 logs pulse-server

# Monitor status
pm2 monit

# View detailed info
pm2 describe pulse-server

# Save PM2 process list
pm2 save

# Resurrect saved processes on reboot
pm2 resurrect
```

### Server Setup

```bash
# Install PM2 globally
npm install -g pm2

# Setup PM2 startup script
pm2 startup systemd
# Run the generated command

# Save process list for auto-start
pm2 save

# Create logs directory
mkdir -p /var/www/pulse-server/logs
```

---

## Troubleshooting

### Pipeline Failures

**PR Lint Failed:**

```bash
# Check commit message format
git log --oneline

# Amend last commit message
git commit --amend

# Force push (if needed)
git push --force-with-lease
```

**Test Pipeline Failed:**

```bash
# Run tests locally
npm test

# Check specific test
npm test -- tests/server.test.js

# View detailed output
npm test -- --verbose
```

**Deployment Failed:**

```bash
# Check SSH connection
ssh deploy@your-server.com

# Check PM2 status
pm2 list

# View error logs
pm2 logs pulse-server --err --lines 50

# Manual deploy
cd /var/www/pulse-server
git pull
npm ci --only=production
pm2 reload ecosystem.config.js --env production
```

### PM2 Issues

**Application Won't Start:**

```bash
# Check logs
pm2 logs pulse-server --lines 100

# Check Node.js version
node --version

# Check environment variables
pm2 env 0

# Delete and restart
pm2 delete pulse-server
pm2 start ecosystem.config.js --env production
```

**Memory Issues:**

```bash
# Check memory usage
pm2 monit

# Increase memory limit in ecosystem.config.js
max_memory_restart: '1G'

# Reload config
pm2 reload ecosystem.config.js
```

---

## Monitoring & Notifications

### Telegram Notifications

You'll receive notifications for:

- ✅ Successful deployments
- ❌ Failed deployments
- 🎉 New releases
- ❌ PR lint failures

### Setup Telegram Bot

1. Create bot with [@BotFather](https://t.me/botfather)
2. Get bot token
3. Add bot to your chat/channel
4. Get chat ID from [@userinfobot](https://t.me/userinfobot)
5. Add secrets to Drone CI

---

## Best Practices

### 1. Commit Messages

```bash
# ✅ Good
feat(api): add user authentication endpoint
fix(security): patch SQL injection vulnerability
docs(readme): update deployment instructions

# ❌ Bad
added stuff
fixed bug
updates
```

### 2. Pull Requests

- Always create PR from feature branch
- Use descriptive PR titles (conventional commits format)
- Include test coverage
- Update documentation
- Wait for CI checks before merging

### 3. Versioning

- Let auto-release handle versioning
- Use manual release only for special cases
- Never manually edit version in package.json
- Always include BREAKING CHANGE: for major bumps

### 4. Deployments

- Test locally before pushing
- Monitor health checks after deployment
- Keep rollback plan ready
- Use staging environment for testing

---

## Quick Reference

| Event           | Pipeline       | Action                           |
| --------------- | -------------- | -------------------------------- |
| Create PR       | PR Lint + Test | Validate commits, run tests      |
| Merge to main   | Auto-Release   | Create version, update changelog |
| Tag pushed      | Release        | Create GitHub release            |
| Main updated    | Build & Deploy | Deploy to production             |
| Develop updated | Build & Deploy | Deploy to staging                |

---

## Environment Setup Checklist

- [ ] Drone CI configured with repository
- [ ] All secrets added to Drone
- [ ] SSH access configured for deployment server
- [ ] PM2 installed on server
- [ ] `/var/www/pulse-server` directory created
- [ ] `.env.production` file on server
- [ ] Telegram bot created and configured
- [ ] GitHub token with repo access
- [ ] Health endpoint implemented
- [ ] Logs directory created

---

## Support

For pipeline issues:

1. Check Drone CI build logs
2. Verify secrets configuration
3. Test SSH connection manually
4. Review PM2 logs on server
5. Check application logs in `/var/www/pulse-server/logs`

For urgent issues, deploy manually:

```bash
ssh deploy@your-server.com
cd /var/www/pulse-server
git pull origin main
npm ci --only=production
pm2 reload ecosystem.config.js --env production
pm2 logs pulse-server
```
