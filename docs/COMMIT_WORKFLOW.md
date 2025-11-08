````markdown
# 🔄 Semantic Versioning & Conventional Commits Workflow

Complete guide to using Conventional Commits with automated semantic versioning for Pulse Server.

## Overview

This workflow automates version bumping based on commit messages:

```
Your Code Changes
       ↓
Conventional Commits
       ↓
Automatic Analysis
       ↓
Semantic Version Bump
       ↓
Updated CHANGELOG.md
       ↓
Git Tag & Release
```

## Quick Start

### 1. Make Changes and Commit

```bash
# Make your code changes
# Then use interactive commit:
npm run commit

# Follow the prompts to create a proper conventional commit
```

### 2. Create Release

```bash
# Analyze commits and bump version automatically
npm run release

# Or specify version explicitly:
npm run release:major    # Breaking changes
npm run release:minor    # New features
npm run release:patch    # Bug fixes
npm run release:beta     # Pre-release
```

### 3. Push to Remote

```bash
# Push commits and tags
git push origin main
git push origin --tags

# Create GitHub Release from tag
```

## Commit Types and Version Bumping

| Commit Type             | Version Bump | Example Command                |
| ----------------------- | ------------ | ------------------------------ |
| `feat`                  | MINOR        | `feat(api): add new endpoint`  |
| `fix`                   | PATCH        | `fix(auth): prevent hijacking` |
| `BREAKING CHANGE`       | MAJOR        | See breaking changes section   |
| `docs`, `test`, `chore` | NONE         | No version bump                |

## Version Progression Examples

### Example 1: New Features Only

```bash
# Current version: 1.0.0

npm run commit
# feat(api): add AI vision endpoint

npm run commit
# feat(services): add new helper utility

npm run release
# Result: 1.0.0 → 1.1.0 (MINOR bump)
# CHANGELOG.md automatically updated
# Git tag v1.1.0 created
```

### Example 2: Bug Fixes Only

```bash
# Current version: 1.1.0

npm run commit
# fix(rate-limit): prevent counter overflow

npm run commit
# fix(auth): validate JWT claims

npm run release
# Result: 1.1.0 → 1.1.1 (PATCH bump)
# CHANGELOG.md automatically updated
# Git tag v1.1.1 created
```

### Example 3: Breaking Changes

```bash
# Current version: 1.1.1

npm run commit
# feat(api): redesign response structure
# BREAKING CHANGE: Response format changed

npm run release
# Result: 1.1.1 → 2.0.0 (MAJOR bump)
# CHANGELOG.md automatically updated
# Git tag v2.0.0 created
```

### Example 4: Mixed Commits

```bash
# Current version: 2.0.0

npm run commit
# feat(api): add webhook support

npm run commit
# fix(middleware): improve error handling

npm run commit
# docs: update README

npm run release
# Analyze all commits:
#   - 1 feat (MINOR)
#   - 1 fix (PATCH)
#   - 1 docs (ignored)
# Result: 2.0.0 → 2.1.0 (MINOR is higher priority)
# CHANGELOG.md automatically updated
# Git tag v2.1.0 created
```

## Detailed Workflow

### Phase 1: Development

```bash
# Create feature branch
git checkout -b feature/new-endpoint

# Make changes
# Test changes
npm test

# Stage changes
git add .
```

### Phase 2: Committing

```bash
# Use interactive commit wizard
npm run commit

# Prompts:
# 1. Select type: feat
# 2. Enter scope: api
# 3. Enter description: add user profile endpoint
# 4. Enter body: (optional) Additional details
# 5. Enter breaking changes: (optional) none
# 6. Confirm: yes

# Result: Creates semantic commit with proper format
```

### Phase 3: Prepare Release

```bash
# Ensure all tests pass
npm test

# Switch to main branch
git checkout main
git merge feature/new-endpoint

# Create release (automatic version bump)
npm run release
```

### Phase 4: Post-Release

```bash
# Verify tag was created
git tag -l

# Push to remote
git push origin main
git push origin v1.1.0

# Create GitHub Release
# 1. Go to GitHub Releases
# 2. Click "New Release"
# 3. Select tag v1.1.0
# 4. Copy CHANGELOG.md content as release notes
# 5. Publish
```

## Automatic Changelog

Standard-version automatically updates `CHANGELOG.md`:

**Before:**

```markdown
## [Unreleased]

(empty - new commits not documented yet)
```

**After `npm run release:`**

```markdown
## [1.1.0] - 2025-11-08

### Features

- **api**: add AI vision endpoint for image analysis
- **services**: add new helper utility

### Bug Fixes

- **middleware**: improve error handling

## [1.0.0] - 2025-11-01

...
```

## Validation

### CommitLint Rules

Commits are validated automatically when you try to commit:

```bash
# ✅ Valid commits
git commit -m "feat(api): add new endpoint"
git commit -m "fix: resolve memory leak"

# ❌ Invalid commits - will be rejected
git commit -m "add stuff"           # No type
git commit -m "FEAT: add stuff"     # Wrong format
git commit -m "feat: Add stuff."    # Capital + period
```

### Manual Validation

```bash
# Check if commit is valid before pushing
npx commitlint --from HEAD~1 --to HEAD

# View all commits since last tag
git log v1.0.0..HEAD --oneline
```

## Release Scripts

### NPM Scripts

```bash
npm run commit              # Interactive conventional commit
npm run release             # Automatic version bump
npm run release:major       # Force MAJOR bump (X.0.0)
npm run release:minor       # Force MINOR bump (x.Y.0)
npm run release:patch       # Force PATCH bump (x.y.Z)
npm run release:beta        # Create beta pre-release
```

### PowerShell Script

Updated `release.ps1` now uses standard-version:

```powershell
.\release.ps1 -VersionType minor
# Uses: npm run release:minor
```

### Bash Script

Updated `release.sh` now uses standard-version:

```bash
./release.sh minor
# Uses: npm run release:minor
```

## Breaking Changes

### Marking Breaking Changes

```
feat(api): redesign response format

BREAKING CHANGE: The POST /api/data endpoint now returns
a different response structure:
- Old: { success: true, data: [...] }
- New: { ok: true, result: [...] }

Migration: See MIGRATION_V2.md for upgrade guide.
```

### Result

```bash
npm run release
# Detects BREAKING CHANGE footer
# Version: 1.0.0 → 2.0.0
# CHANGELOG.md updated with breaking change notice
```

## Git Hooks

### Commit Message Hook

The `.husky/commit-msg` hook automatically:

1. Validates commit message format
2. Enforces conventional commit rules
3. Rejects invalid commits with error message

### What Gets Validated

✅ Type is valid (feat, fix, docs, etc.)
✅ Type is lowercase
✅ Description is not empty
✅ Description doesn't end with period
✅ Header is under 72 characters
✅ Body has blank line before it
✅ Footer has blank line before it

### Bypass Hook (Not Recommended)

```bash
# Skip validation (dangerous!)
git commit --no-verify -m "invalid message"
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Release

on:
  push:
    branches: [main]
    paths-ignore:
      - "docs/**"
      - "README.md"

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm test

  release:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run release
      - run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git push origin main --tags
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          body_path: ${{ github.workspace }}/CHANGELOG.md
```

## Troubleshooting

### Q: Commit was rejected by CommitLint

**A:** Check message format:

```
type(scope): description

# Correct format:
feat(api): add new endpoint
fix(auth): prevent hijacking
docs: update guide

# Incorrect:
add feature
FIX: prevent issue
feat: Add Feature (capital A)
```

### Q: Release doesn't bump version

**A:** Ensure commits follow conventional format:

```bash
# Check commit history
git log --oneline -5

# Commits must be:
# feat(...) for MINOR
# fix(...) for PATCH
# BREAKING CHANGE for MAJOR
```

### Q: Can I commit without using npm run commit?

**A:** Yes, but ensure format is correct:

```bash
git commit -m "feat(scope): description"
# Will be validated by commitlint hook
```

### Q: How do I revert to previous version?

**A:** Use git revert or reset:

```bash
# Soft reset (keep changes)
git reset --soft v1.0.0

# Hard reset (discard changes)
git reset --hard v1.0.0

# Create revert commit
git revert v1.0.0
```

## Best Practices

### ✅ DO

- ✅ Use `npm run commit` for consistent formatting
- ✅ Review commits before release
- ✅ Test before committing
- ✅ Use descriptive messages
- ✅ Group related changes
- ✅ Push tags to remote

### ❌ DON'T

- ❌ Skip conventional commit format
- ❌ Mix different concerns in one commit
- ❌ Commit untested code
- ❌ Force push to main
- ❌ Ignore validation errors
- ❌ Release without testing

## Example Complete Workflow

```bash
# 1. Create feature branch
git checkout -b feature/api-improvement

# 2. Make changes
# ... edit files ...

# 3. Test changes
npm test
# ✓ 11/11 tests passing

# 4. Stage and commit
git add .
npm run commit
# Follow interactive prompts

# 5. Switch to main and merge
git checkout main
git merge feature/api-improvement

# 6. Create release
npm run release
# Analyzes commits, bumps version
# Updates CHANGELOG.md
# Creates git tag

# 7. View new version
npm pkg get version
# "1.1.0"

# 8. Push to remote
git push origin main
git push origin v1.1.0

# 9. Create GitHub Release
# Go to GitHub → Releases → New Release
# Select tag: v1.1.0
# Add release notes from CHANGELOG.md
# Publish
```

## Related Documentation

- [Conventional Commits Guide](./CONVENTIONAL_COMMITS.md)
- [Semantic Versioning](./VERSIONING.md)
- [Changelog](./CHANGELOG.md)
- [Release Guide](./RELEASES.md)

## Tools Used

| Tool                 | Purpose                    | Docs                                                                                                             |
| -------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **commitizen**       | Interactive commit prompts | [commitizen.github.io](http://commitizen.github.io/cz-cli/)                                                      |
| **standard-version** | Automatic versioning       | [github.com/conventional-changelog/standard-version](https://github.com/conventional-changelog/standard-version) |
| **commitlint**       | Validate commits           | [commitlint.js.org](https://commitlint.js.org/)                                                                  |
| **husky**            | Git hooks                  | [typicode.github.io/husky](https://typicode.github.io/husky/)                                                    |

---

**Automated versioning based on meaningful commits!** 🎯
````
