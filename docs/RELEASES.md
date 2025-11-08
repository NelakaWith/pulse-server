# 📦 Releases & Semantic Versioning

This document outlines the release process and versioning strategy for Pulse Server.

## 🔢 Semantic Versioning

We follow **Semantic Versioning 2.0.0** for all releases: `MAJOR.MINOR.PATCH`

### Version Format

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
│     │     │      │          │
│     │     │      │          └─ Build metadata (optional)
│     │     │      └────────────── Pre-release version (optional)
│     │     └─────────────────── Bug fixes, non-breaking changes
│     └────────────────────────── New features, backward compatible
└───────────────────────────────── Breaking changes
```

### Examples

- `1.0.0` - Initial release
- `1.1.0` - New feature added
- `1.1.1` - Bug fix
- `1.2.0-beta.1` - Beta pre-release
- `2.0.0` - Breaking changes

## 📋 Versioning Rules

### MAJOR (Breaking Changes)

Increment when you make incompatible API changes:

- ✅ Remove endpoints
- ✅ Change authentication method
- ✅ Restructure response format
- ✅ Remove configuration options
- ✅ Drop Node.js version support

**Example:** `1.0.0` → `2.0.0`

```javascript
// BREAKING: Response structure changed
// v1: { success: true, data: {...} }
// v2: { ok: true, result: {...} }  // BREAKING CHANGE
```

### MINOR (New Features)

Increment when you add functionality in a backward-compatible manner:

- ✅ Add new endpoints
- ✅ Add optional parameters
- ✅ Add new authentication methods (alongside existing)
- ✅ Improve performance
- ✅ Add new AI models support
- ✅ Extend rate limiting with new features

**Example:** `1.0.0` → `1.1.0`

```javascript
// MINOR: New endpoint added
router.post("/api/ai/vision", (req, res) => {
  // New feature, backward compatible
});
```

### PATCH (Bug Fixes)

Increment for bug fixes and non-breaking updates:

- ✅ Fix security vulnerabilities
- ✅ Fix bugs in existing features
- ✅ Update dependencies (patches)
- ✅ Improve documentation
- ✅ Optimize performance

**Example:** `1.0.0` → `1.0.1`

```javascript
// PATCH: Fix rate limit calculation bug
if (rateLimitRemaining <= 0) {
  // Fixed: was <
  return res.status(429).json({ error: "Rate limited" });
}
```

## 🏷️ Pre-release Versions

Use pre-release versions for versions under development:

- `1.1.0-alpha.1` - Early development
- `1.1.0-beta.1` - Feature complete, testing
- `1.1.0-rc.1` - Release candidate
- `1.1.0` - Final release

**Usage:**

```bash
npm install pulse-server@1.1.0-beta.1
```

## 🔄 Release Process

### Step 1: Prepare Release Branch

```bash
# Create release branch
git checkout -b release/1.1.0

# Update package.json version
npm version minor --no-git-tag-v
# This updates version and creates commit

# Or manually update
npm pkg set version=1.1.0
```

### Step 2: Update Documentation

Create/update `CHANGELOG.md` entry:

```markdown
## [1.1.0] - 2025-11-08

### Added

- New `/api/ai/vision` endpoint for image analysis
- Support for Claude 3 Opus model
- Rate limit increase to 1000 for premium keys

### Changed

- Improved error messages for API key failures
- Optimized repository analysis performance

### Fixed

- Fixed rate limit header parsing
- Resolved CORS issue with preflight requests

### Security

- Updated dependencies for security patches
- Added rate limit for login attempts

### Deprecated

- `DEFAULT_AI_MODEL` env var (use `OPENROUTER_DEFAULT_MODEL`)
```

### Step 3: Tag Release

```bash
# Create annotated tag
git tag -a v1.1.0 -m "Release version 1.1.0"

# Push tag to remote
git push origin v1.1.0

# Or push with commits
git push origin release/1.1.0
```

### Step 4: Create Release Notes

On GitHub, create a release:

```
Title: Release v1.1.0 - AI Vision & Performance Improvements

Tag: v1.1.0
Target: main

✨ New Features
- AI vision endpoint for image analysis
- Claude 3 Opus model support
- Higher rate limits for premium users

🐛 Bug Fixes
- Fixed rate limit header parsing
- Resolved CORS preflight issues

📈 Performance
- 40% faster repository analysis
- Reduced memory usage

🔐 Security
- Security patches for dependencies
```

### Step 5: Publish Release

```bash
# Create GitHub Release
# - Attach binaries if applicable
# - Link to CHANGELOG
# - Mention breaking changes prominently

# Publish to npm (if applicable)
npm publish
```

## 📝 CHANGELOG Format

Keep a `CHANGELOG.md` file following [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- New features in development

### Changed

- Behavior changes

### Fixed

- Bug fixes

## [1.1.0] - 2025-11-08

### Added

- New AI vision endpoint
- Claude 3 Opus support
- Premium rate limits

### Changed

- Improved error messages
- Optimized performance

### Fixed

- Rate limit parsing
- CORS issues

### Security

- Dependency updates

### Deprecated

- OLD_ENV_VAR is deprecated, use NEW_ENV_VAR

## [1.0.0] - 2025-11-01

### Added

- Initial release
- API key authentication
- Rate limiting
- OpenRouter integration
```

## 🚀 Release Checklist

Before releasing, ensure:

**Code Quality:**

- [ ] All tests passing (`npm test`)
- [ ] No console.log statements (except logging service)
- [ ] Linting clean (if ESLint configured)
- [ ] No hardcoded secrets
- [ ] Code reviewed

**Documentation:**

- [ ] README.md updated
- [ ] CHANGELOG.md updated
- [ ] API_GUIDE.md updated (if API changes)
- [ ] Migration guide for breaking changes
- [ ] Examples updated

**Testing:**

- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Security audit done
- [ ] Performance tested

**Dependencies:**

- [ ] Dependencies up to date
- [ ] Security vulnerabilities fixed
- [ ] Breaking dependency updates handled
- [ ] Peer dependencies compatible

**Deployment:**

- [ ] Staging deployment tested
- [ ] Environment variables documented
- [ ] Rollback plan prepared
- [ ] Monitoring configured

## 🔍 Version Naming Examples

### Real-world Examples

**1.0.0** - Initial Release

- First stable production release
- All core features implemented

**1.1.0** - AI Vision Support

```
- Added /api/ai/vision endpoint
- Added image analysis capability
- Added new model support
```

**1.1.1** - Security Patch

```
- Fixed XSS vulnerability in error messages
- Updated dependencies
```

**1.2.0** - Enhanced Rate Limiting

```
- Added tiered rate limiting
- Added rate limit monitoring endpoint
- Added per-user rate limits
```

**2.0.0** - Major Redesign (Breaking)

```
- Changed authentication from API key to JWT
- Restructured response format
- Dropped Node.js 14 support
```

## 📊 Version Lifecycle

```
Development
    ↓
v1.0.0-alpha.1 (Milestone 1)
    ↓
v1.0.0-beta.1  (Feature complete)
    ↓
v1.0.0-rc.1    (Release candidate)
    ↓
v1.0.0         (Production release)
    ↓
v1.0.1         (Patch/bug fix)
    ↓
v1.1.0         (New features)
    ↓
v1.1.1         (Patch)
    ↓
v2.0.0         (Breaking changes)
```

## 🏗️ Development Version Numbers

During development, use these patterns:

```
main (default)
├── v1.1.0-dev.1      (Development version)
├── v1.1.0-alpha.1    (Early alpha)
├── v1.1.0-beta.1     (Feature complete)
├── v1.1.0-rc.1       (Release candidate)
└── v1.1.0            (Release)
```

## 📦 Version Management Commands

### Update Version (NPM)

```bash
# Patch release (1.0.0 → 1.0.1)
npm version patch --no-git-tag-v

# Minor release (1.0.0 → 1.1.0)
npm version minor --no-git-tag-v

# Major release (1.0.0 → 2.0.0)
npm version major --no-git-tag-v

# Pre-release (1.0.0 → 1.1.0-beta.1)
npm version premajor --no-git-tag-v --preid=beta
npm version preminor --no-git-tag-v --preid=beta
npm version prepatch --no-git-tag-v --preid=beta

# Check current version
npm pkg get version
```

### View Release History

```bash
# List all tags
git tag -l

# View specific release
git show v1.0.0

# Compare versions
git diff v1.0.0 v1.1.0

# Show release notes
git log v1.0.0..v1.1.0 --oneline
```

## 🔗 Linking Versions

### Docker Images

```dockerfile
FROM node:18-alpine as v1.1.0
```

### Package Registry

```bash
# Publish to npm with tag
npm publish --tag latest
npm publish --tag beta
npm publish --tag experimental
```

### GitHub Releases

Release assets can include:

- Compiled binaries
- Docker images
- Documentation
- Migration guides

## 🔄 Backward Compatibility

### Maintain Compatibility in Minor/Patch

```javascript
// v1.0.0
router.get("/api/data", (req, res) => {
  res.json({ success: true, data: [...] });
});

// v1.1.0 - Add new parameter, keep old format
router.get("/api/data", (req, res) => {
  const format = req.query.format || "legacy";

  if (format === "v2") {
    res.json({ ok: true, result: [...] });
  } else {
    res.json({ success: true, data: [...] });  // Keep old format
  }
});
```

### Deprecate Before Removing

```javascript
// v1.1.0 - Deprecate
app.use((req, res, next) => {
  if (req.path === "/api/old-endpoint") {
    res.set("Deprecation", "true");
    res.set("Sunset", "Sun, 01 Jan 2026 00:00:00 GMT");
    next();
  }
});

// v2.0.0 - Remove
// Old endpoint completely removed
```

## 📚 Additional Resources

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- [npm versioning](https://docs.npmjs.com/cli/v9/commands/npm-version)

## 🎯 Current Version

**Current:** `1.0.0` (Production Release)

### Next Planned Releases

- **v1.1.0** - AI Vision & Enhanced Models
- **v1.2.0** - Webhook Support
- **v2.0.0** - JWT Authentication & Redesign

---

**Last Updated:** November 8, 2025
**Maintained By:** Development Team
