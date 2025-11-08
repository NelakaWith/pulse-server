# 🏷️ Versioning & Release Management Guide

This guide covers semantic versioning, release processes, and version management for Pulse Server.

## Quick Links

- 📖 [Full Releases Guide](./RELEASES.md) - Comprehensive versioning documentation
- 📋 [Changelog](./CHANGELOG.md) - Complete release history
- 📦 [package.json](../package.json) - Current version info

## Current Version

**v1.0.0** - Initial Production Release

## Semantic Versioning

We follow **Semantic Versioning 2.0.0**: `MAJOR.MINOR.PATCH`

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
  │     │     │      │          │
  │     │     │      │          └─ Build metadata (optional)
  │     │     │      └────────────── Pre-release (alpha, beta, rc)
  │     │     └─────────────────── Bug fixes and patches
  │     └────────────────────────── New features (backward compatible)
  └───────────────────────────────── Breaking changes
```

## Quick Release

### Windows (PowerShell)

```powershell
# Minor release (1.0.0 → 1.1.0)
.\release.ps1 -VersionType minor

# Patch release (1.0.0 → 1.0.1)
.\release.ps1 -VersionType patch

# Pre-release beta
.\release.ps1 -VersionType preminor -PrereleaseId beta
```

### macOS/Linux (Bash)

```bash
# Minor release (1.0.0 → 1.1.0)
./release.sh minor

# Patch release (1.0.0 → 1.0.1)
./release.sh patch

# Pre-release beta
./release.sh preminor beta
```

### Manual (using npm)

```bash
# Minor release
npm version minor --no-git-tag-v

# Patch release
npm version patch --no-git-tag-v

# Major release
npm version major --no-git-tag-v
```

## Release Types

### MAJOR - Breaking Changes (e.g., 1.0.0 → 2.0.0)

When to use:

- Remove or rename endpoints
- Change authentication system
- Restructure response format
- Drop Node.js version support
- Incompatible database schema changes

Example:

```javascript
// v1.0.0
GET /api/data → { success: true, data: [...] }

// v2.0.0 (BREAKING)
GET /api/data → { ok: true, result: [...] }
```

### MINOR - New Features (e.g., 1.0.0 → 1.1.0)

When to use:

- Add new endpoints
- Add optional parameters
- Support new AI models
- Improve performance
- Add new authentication methods (alongside existing)
