# 🚀 CI/CD Setup Guide

## Quick Start

This guide will help you set up the complete CI/CD pipeline for Pulse Server using Drone CI.

## Prerequisites

- Drone CI server installed and configured
- GitHub repository connected to Drone CI
- SSH access to your deployment server
- PM2 installed on deployment server
- Telegram bot for notifications (optional)

## Step 1: Configure Drone Secrets

Add these secrets in your Drone CI repository settings:

### Deployment Secrets

```
deploy_host          # e.g., your-server.com or 192.168.1.100
deploy_username      # e.g., deploy or ubuntu
deploy_ssh_key       # Your SSH private key (full content)
```

### GitHub Integration

```
github_token         # GitHub personal access token with repo access
```

### Notifications (Optional)

```
telegram_token       # Telegram bot token from @BotFather
telegram_chat_id     # Your Telegram chat ID
```

### Drone Integration (for auto-release)

```
drone_server         # e.g., https://drone.your-domain.com
drone_token          # Drone API token from user settings
```

## Step 2: Prepare Deployment Server

### Install PM2

```bash
# SSH into your server
ssh deploy@your-server.com

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 startup script
pm2 startup systemd
# Run the command that PM2 outputs
```

### Create Deployment Directory

```bash
# Create application directory
sudo mkdir -p /var/www/pulse-server
sudo chown $USER:$USER /var/www/pulse-server

# Create logs directory
mkdir -p /var/www/pulse-server/logs

# Create production environment file
nano /var/www/pulse-server/.env.production
```

### Configure `.env.production` on Server

```env
NODE_ENV=production
PORT=3000

# API Keys (generate new ones for production)
API_KEY_AUTH_ENABLED=true
API_KEYS=sk-prod-xxxxx,sk-prod-yyyyy

# GitHub Configuration
GITHUB_TOKEN=your_production_github_pat
GITHUB_GRAPHQL_API_BASE_URL=https://api.github.com/graphql

# OpenRouter AI
OPENROUTER_API_KEY=your_production_openrouter_key
DEFAULT_AI_MODEL=gpt-4

# CORS (restrict to your domain)
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## Step 3: Configure SSH Access

### Generate SSH Key Pair (if needed)

```bash
# On your local machine
ssh-keygen -t ed25519 -C "drone-ci-deploy" -f ~/.ssh/drone_deploy

# Copy public key to server
ssh-copy-id -i ~/.ssh/drone_deploy.pub deploy@your-server.com

# Test connection
ssh -i ~/.ssh/drone_deploy deploy@your-server.com
```

### Add Private Key to Drone

1. Open your SSH private key:

   ```bash
   cat ~/.ssh/drone_deploy
   ```

2. Copy the entire content (including `-----BEGIN` and `-----END` lines)

3. In Drone CI:
   - Go to Repository Settings
   - Add Secret: `deploy_ssh_key`
   - Paste the private key content
   - Save

## Step 4: Verify Pipeline Files

Ensure these files exist in your repository:

```
pulse-server/
├── .drone.yml              # Main pipeline (test, build, deploy)
├── .drone-pr-lint.yml      # PR linting pipeline
├── .drone-release.yml      # Auto-release pipeline
└── ecosystem.config.js     # PM2 configuration
```

All files are already created in your repository. ✅

## Step 5: Enable Pipelines in Drone

1. Go to Drone CI web interface
2. Navigate to your repository
3. Go to Settings
4. Enable the repository (if not already enabled)
5. Verify these settings:
   - **Trusted**: Enable (if using plugins)
   - **Protected**: Disable (for development)
   - **Timeout**: 60 minutes

## Step 6: Test the Pipeline

### Test 1: PR Lint Pipeline

```bash
# Create a feature branch
git checkout -b feat/test-pipeline

# Make a change
echo "# Test" >> TEST.md

# Commit using conventional commits
npm run commit
# Select: feat
# Scope: ci
# Description: test pipeline setup

# Push and create PR
git push origin feat/test-pipeline
```

**Expected Result:**

- ✅ PR Lint pipeline runs
- ✅ Validates commit format
- ✅ Runs tests

### Test 2: Merge and Auto-Release

```bash
# Merge PR to main (via GitHub or locally)
git checkout main
git merge feat/test-pipeline
git push origin main
```

**Expected Result:**

- ✅ Auto-release pipeline runs
- ✅ Creates new version (e.g., v1.1.0)
- ✅ Updates CHANGELOG.md
- ✅ Creates git tag

### Test 3: Deployment Pipeline

```bash
# The deployment should trigger automatically after release
# Or manually trigger by pushing a tag
git tag v1.0.1
git push origin v1.0.1
```

**Expected Result:**

- ✅ Build and deploy pipeline runs
- ✅ Files copied to server via SCP
- ✅ Dependencies installed on server
- ✅ PM2 reloads application
- ✅ Health checks pass
- ✅ Telegram notification sent (if configured)

## Step 7: Verify Deployment

### On Server

```bash
# SSH into server
ssh deploy@your-server.com

# Check PM2 status
pm2 list
pm2 describe pulse-server

# View logs
pm2 logs pulse-server --lines 50

# Test application
curl http://localhost:3000/health
```

**Expected Output:**

```json
{
  "status": "ok",
  "timestamp": "2025-11-08T10:30:00.000Z",
  "uptime": 123.45,
  "version": "1.0.0"
}
```

### From External

```bash
# Test from your local machine
curl https://your-server.com/health

# Test with API key
curl -H "X-API-Key: sk-prod-xxxxx" https://your-server.com/api/enrichment
```

## Troubleshooting

### Pipeline Fails: SSH Connection Error

**Symptom:** `Permission denied (publickey)` error in Drone logs

**Solution:**

1. Verify SSH key format in Drone secret
2. Ensure public key is in `~/.ssh/authorized_keys` on server
3. Check SSH key permissions on server: `chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys`
4. Test SSH connection manually: `ssh -i ~/.ssh/drone_deploy deploy@your-server.com`

### Pipeline Fails: PM2 Command Not Found

**Symptom:** `pm2: command not found` in deployment logs

**Solution:**

1. Install PM2 globally: `sudo npm install -g pm2`
2. Verify PM2 in PATH: `which pm2`
3. Update `.drone.yml` to use full PM2 path if needed

### Deployment Succeeds but Health Check Fails

**Symptom:** Health check returns non-200 status

**Solution:**

1. Check PM2 logs: `pm2 logs pulse-server`
2. Verify `.env.production` exists on server
3. Check port availability: `netstat -tuln | grep 3000`
4. Verify firewall rules allow port 3000
5. Check application logs: `cat /var/www/pulse-server/logs/error.log`

### Auto-Release Not Creating Version

**Symptom:** Commits merged but no release created

**Solution:**

1. Verify commits follow conventional format: `git log --oneline`
2. Ensure commits are `feat:` or `fix:` (not `docs:`, `chore:`)
3. Check `.drone-release.yml` is in repository root
4. Review Drone logs for release pipeline

### Telegram Notifications Not Working

**Symptom:** No Telegram messages received

**Solution:**

1. Verify bot token and chat ID in Drone secrets
2. Test bot manually: Send `/start` to your bot
3. Ensure bot is added to your chat/channel
4. Check Drone logs for notification errors

## Monitoring

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# CPU/Memory usage
pm2 status

# Detailed process info
pm2 describe pulse-server

# View all logs
pm2 logs
```

### Application Logs

```bash
# Error logs
tail -f /var/www/pulse-server/logs/error.log

# Output logs
tail -f /var/www/pulse-server/logs/out.log

# Combined (last 100 lines)
pm2 logs pulse-server --lines 100
```

### Drone CI Logs

1. Go to Drone web interface
2. Click on your repository
3. Select a build
4. View step-by-step logs

## Maintenance

### Update Dependencies

```bash
# On development machine
npm update
npm audit fix

# Commit and push
npm run commit
# Type: chore
# Scope: deps
# Description: update dependencies

git push origin main
# CI will automatically test and deploy
```

### Rotate API Keys

```bash
# Generate new production keys
node utils/generateApiKey.js prod 3

# Update .env.production on server
ssh deploy@your-server.com
nano /var/www/pulse-server/.env.production
# Add new keys to API_KEYS

# Reload application
pm2 reload pulse-server
```

### Manual Deployment

If CI fails, deploy manually:

```bash
# SSH into server
ssh deploy@your-server.com

# Navigate to app directory
cd /var/www/pulse-server

# Pull latest code
git pull origin main

# Install dependencies
npm ci --only=production

# Reload with PM2
pm2 reload ecosystem.config.js --env production

# Verify
pm2 logs pulse-server
curl http://localhost:3000/health
```

## Best Practices

### 1. Always Use Conventional Commits

```bash
# ✅ Good
npm run commit

# ❌ Bad
git commit -m "fixed stuff"
```

### 2. Test Locally Before Pushing

```bash
npm test
npm start
# Test endpoints manually
```

### 3. Use Feature Branches

```bash
# ✅ Good workflow
git checkout -b feat/new-feature
# Make changes
npm run commit
git push origin feat/new-feature
# Create PR

# ❌ Bad workflow
git checkout main
# Make changes directly on main
git push origin main
```

### 4. Monitor Deployments

- Check Drone CI logs after every deployment
- Verify health checks pass
- Review PM2 logs for errors
- Test critical endpoints

### 5. Keep Secrets Secure

- Never commit `.env.production` to git
- Rotate API keys regularly
- Use separate keys for dev/staging/prod
- Limit access to Drone secrets

## Support

For issues:

1. Check Drone CI logs
2. Review PM2 logs on server
3. Verify secrets configuration
4. Test SSH connection manually
5. Review [CI_CD_PIPELINE.md](./CI_CD_PIPELINE.md) for detailed documentation

For urgent issues, use manual deployment as shown above.

---

**✅ Setup Complete!** Your CI/CD pipeline is now ready.

Next steps:

1. Make a commit using `npm run commit`
2. Create a PR and watch CI run
3. Merge PR and watch auto-release
4. Verify deployment on server
