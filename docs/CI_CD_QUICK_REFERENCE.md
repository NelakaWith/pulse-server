# 🚀 CI/CD Quick Reference

## Drone CI Pipelines

| Pipeline         | File                 | Trigger                    | Purpose                       |
| ---------------- | -------------------- | -------------------------- | ----------------------------- |
| **Test**         | `.drone.yml`         | PR created/updated         | Run tests and lint commits    |
| **PR Lint**      | `.drone-pr-lint.yml` | PR created/updated         | Validate conventional commits |
| **Auto-Release** | `.drone-release.yml` | Push to main               | Create semantic version       |
| **Deploy**       | `.drone.yml`         | Tag pushed or main updated | Deploy to production          |

## Common Commands

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feat/new-feature

# 2. Make changes and commit
npm run commit

# 3. Push and create PR
git push origin feat/new-feature

# 4. After PR approved, merge to main
git checkout main
git merge feat/new-feature
git push origin main

# Auto-release will create version and deploy
```

### PM2 Commands

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Zero-downtime reload
pm2 reload pulse-server

# Restart application
pm2 restart pulse-server

# Stop application
pm2 stop pulse-server

# Delete from PM2
pm2 delete pulse-server

# View logs
pm2 logs pulse-server

# Monitor in real-time
pm2 monit

# Show process details
pm2 describe pulse-server

# List all processes
pm2 list

# Save process list
pm2 save

# Resurrect saved processes
pm2 resurrect
```

### Deployment Commands

```bash
# Manual deployment (if CI fails)
ssh deploy@your-server.com
cd /var/www/pulse-server
git pull origin main
npm ci --only=production
pm2 reload ecosystem.config.js --env production

# Check deployment status
pm2 logs pulse-server --lines 50
curl http://localhost:3000/health
```

### Release Commands

```bash
# Automatic (based on commits)
npm run release

# Explicit version bump
npm run release:major     # 1.0.0 → 2.0.0
npm run release:minor     # 1.0.0 → 1.1.0
npm run release:patch     # 1.0.0 → 1.0.1
npm run release:beta      # 1.0.0 → 1.0.1-beta.0

# Push release
git push origin main --tags
```

### Testing Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- server.test.js

# Watch mode
npm test -- --watch
```

## Commit Types

| Type              | Version Bump          | Example                        |
| ----------------- | --------------------- | ------------------------------ |
| `feat`            | Minor (1.0.0 → 1.1.0) | `feat(api): add endpoint`      |
| `fix`             | Patch (1.0.0 → 1.0.1) | `fix(auth): validate token`    |
| `BREAKING CHANGE` | Major (1.0.0 → 2.0.0) | `BREAKING CHANGE: new API`     |
| `docs`            | None                  | `docs: update README`          |
| `chore`           | None                  | `chore(deps): update packages` |
| `test`            | None                  | `test: add unit tests`         |
| `refactor`        | None                  | `refactor: optimize code`      |
| `style`           | None                  | `style: format code`           |
| `perf`            | Patch                 | `perf(api): improve speed`     |
| `ci`              | None                  | `ci: update drone config`      |

## Scopes

Available scopes for commits:

- `api` - API endpoints
- `auth` - Authentication
- `rate-limit` - Rate limiting
- `security` - Security features
- `docs` - Documentation
- `tests` - Test files
- `deps` - Dependencies
- `config` - Configuration
- `middleware` - Middleware
- `services` - Services
- `routes` - Routes
- `utils` - Utilities
- `release` - Release process

## Secrets Required

### Drone CI Secrets

```
deploy_host          # Server hostname or IP
deploy_username      # SSH username
deploy_ssh_key       # SSH private key (full content)
github_token         # GitHub PAT with repo access
telegram_token       # Telegram bot token (optional)
telegram_chat_id     # Telegram chat ID (optional)
drone_server         # Drone server URL
drone_token          # Drone API token
```

### Server Environment Variables

Create `/var/www/pulse-server/.env.production`:

```env
NODE_ENV=production
PORT=3000
API_KEY_AUTH_ENABLED=true
API_KEYS=sk-prod-xxxxx,sk-prod-yyyyy
GITHUB_API_TOKEN=github_pat_xxxxx
OPENROUTER_API_KEY=sk-or-v1-xxxxx
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

## Health Check Endpoints

```bash
# Basic health check
curl http://localhost:3000/health

# With API key
curl -H "X-API-Key: sk-prod-xxxxx" http://localhost:3000/api/enrichment

# External health check
curl https://your-server.com/health
```

## Troubleshooting

### Pipeline Failed

```bash
# Check Drone CI logs
# Go to https://drone.your-domain.com/your-org/pulse-server

# Check PM2 logs on server
ssh deploy@your-server.com
pm2 logs pulse-server --lines 100

# Manual deploy
cd /var/www/pulse-server
git pull
npm ci --only=production
pm2 reload ecosystem.config.js --env production
```

### Application Not Starting

```bash
# Check PM2 status
pm2 list
pm2 describe pulse-server

# Check error logs
pm2 logs pulse-server --err --lines 50

# Restart application
pm2 restart pulse-server

# Delete and start fresh
pm2 delete pulse-server
pm2 start ecosystem.config.js --env production
```

### Health Check Failing

```bash
# Check if app is running
pm2 list

# Check logs
pm2 logs pulse-server

# Check port
netstat -tuln | grep 3000

# Test locally
curl http://localhost:3000/health

# Check firewall
sudo ufw status
```

### SSH Connection Issues

```bash
# Test SSH connection
ssh -i ~/.ssh/drone_deploy deploy@your-server.com

# Verify key permissions
chmod 600 ~/.ssh/drone_deploy
chmod 700 ~/.ssh

# Check authorized_keys on server
cat ~/.ssh/authorized_keys

# Fix permissions on server
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## Monitoring

### Check Pipeline Status

1. Go to Drone CI web interface
2. View build history
3. Check individual step logs
4. Review test results

### Check Deployment Status

```bash
# PM2 status
pm2 status

# Real-time monitoring
pm2 monit

# CPU/Memory usage
pm2 describe pulse-server

# Application logs
tail -f /var/www/pulse-server/logs/error.log
tail -f /var/www/pulse-server/logs/out.log
```

### Check Application Health

```bash
# Health endpoint
curl http://localhost:3000/health

# API endpoints
curl -H "X-API-Key: sk-prod-xxxxx" http://localhost:3000/api/enrichment

# Check response time
time curl http://localhost:3000/health
```

## Rollback

### Rollback to Previous Version

```bash
# On server
ssh deploy@your-server.com
cd /var/www/pulse-server

# View tags
git tag -l

# Checkout previous version
git checkout v1.0.0

# Reinstall dependencies
npm ci --only=production

# Reload PM2
pm2 reload ecosystem.config.js --env production

# Verify
curl http://localhost:3000/health
pm2 logs pulse-server
```

### Rollback via PM2

```bash
# If PM2 saved previous config
pm2 resurrect

# Or restart with saved config
pm2 restart ecosystem.config.js --env production
```

## Best Practices

### ✅ DO

- Use `npm run commit` for all commits
- Test locally before pushing
- Create PRs for all changes
- Monitor CI pipelines
- Check health after deployment
- Rotate API keys regularly
- Keep secrets secure

### ❌ DON'T

- Commit directly to main
- Skip tests
- Hardcode secrets
- Deploy without testing
- Ignore CI failures
- Use dev keys in production
- Commit `.env.production`

## Quick Setup Checklist

- [ ] Drone CI configured
- [ ] Secrets added to Drone
- [ ] SSH access configured
- [ ] PM2 installed on server
- [ ] `.env.production` created on server
- [ ] Deployment directory created
- [ ] First deployment tested
- [ ] Health checks passing
- [ ] Logs reviewing properly
- [ ] Monitoring configured

## Support

- 📖 [CI/CD Pipeline Docs](./CI_CD_PIPELINE.md)
- 🚀 [CI/CD Setup Guide](./CI_CD_SETUP.md)
- 📝 [Conventional Commits](./CONVENTIONAL_COMMITS.md)
- 🔄 [Commit Workflow](./COMMIT_WORKFLOW.md)

---

**Need help?** Check logs → Review secrets → Test SSH → Manual deploy
