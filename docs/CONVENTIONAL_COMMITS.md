# 📋 Conventional Commits Guide

Pulse Server uses **Conventional Commits** to standardize commit messages and enable automatic semantic versioning.

## Overview

Conventional Commits is a specification for adding human and machine readable meaning to commit messages. The commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

| Type         | Emoji | Description                                           | Version |
| ------------ | ----- | ----------------------------------------------------- | ------- |
| **feat**     | ✨    | A new feature                                         | MINOR   |
| **fix**      | 🐛    | A bug fix                                             | PATCH   |
| **docs**     | 📚    | Documentation only changes                            | NONE    |
| **style**    | 🎨    | Formatting, missing semicolons, etc (no code change)  | NONE    |
| **refactor** | ♻️    | Code change that neither fixes a bug nor adds feature | NONE    |
| **perf**     | ⚡    | Code change that improves performance                 | PATCH   |
| **test**     | ✅    | Adding missing tests or correcting existing tests     | NONE    |
| **chore**    | 🔧    | Changes to build process, dependencies, or tooling    | NONE    |
| **ci**       | 👷    | Changes to CI configuration files and scripts         | NONE    |
| **revert**   | ⏮️    | Reverts a previous commit                             | PATCH   |

## Scopes

Scopes help identify which part of the codebase is affected:

- **api** - API endpoints and routes
- **auth** - Authentication and authorization
- **rate-limit** - Rate limiting functionality
- **security** - Security features and fixes
- **docs** - Documentation
- **tests** - Test files and test configuration
- **deps** - Dependencies and package management
- **config** - Configuration files
- **middleware** - Middleware components
- **services** - Business logic services
- **routes** - Route handlers
- **utils** - Utility functions
- **release** - Release and versioning

## Examples

### Example 1: New Feature

```
feat(api): add AI vision endpoint for image analysis

- Implements new POST /api/ai/vision endpoint
- Supports multiple image formats (PNG, JPG, WebP)
- Integrates with OpenRouter vision models
```

**Result:** Version bumped to v1.1.0 (MINOR)

### Example 2: Bug Fix

```
fix(rate-limit): prevent rate limit counter overflow

Fixes #123

The rate limit counter was not properly resetting,
causing incorrect rate limiting behavior after 24 hours.
```

**Result:** Version bumped to v1.0.1 (PATCH)

### Example 3: Documentation

```
docs: add conventional commits guide

- Document commit types and scopes
- Add examples of commit messages
- Explain automatic version bumping
```

**Result:** No version bump

### Example 4: Breaking Change

```
feat(api): redesign repository analysis response structure

BREAKING CHANGE: The response format for POST /api/enrichment has changed:
- Old: { success, data: { analysis, metadata } }
- New: { ok, result: { analysis, stats, metadata } }

This is a breaking change and requires API client updates.
```

**Result:** Version bumped to v2.0.0 (MAJOR)

## Commit Message Format Rules

### Type

- **Required**
- Must be one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `revert`
- Must be lowercase

### Scope

- **Optional**
- Identifies affected component
- Wrapped in parentheses: `(scope)`
- Must be lowercase
- Can be custom if not in predefined list

### Description

- **Required**
- Imperative mood ("add", "fix", "implement" not "added", "fixed", "implements")
- No capital letter at start
- No period (.) at end
- Maximum 72 characters (short form)

### Body

- **Optional**
- Separated from description by blank line
- Explains **what** and **why**, not **how**
- Wrapped at 100 characters
- Can reference issues: "Fixes #123", "Resolves #456"

### Footer

- **Optional**
- Separated from body by blank line
- Reference issues or breaking changes
- Format: `Key: value` or `Key #number`

## Breaking Changes

Breaking changes must be clearly marked:

```
feat(api): redesign authentication system

BREAKING CHANGE: API Key authentication is now required for all endpoints.
Old behavior: Endpoints accessible without authentication
New behavior: All endpoints require X-API-Key header or query parameter
Migration: See MIGRATION.md for upgrade guide
```

## Usage

### Interactive Commit with Commitizen

```bash
npm run commit
```

This opens an interactive prompt:

1. Select commit type
2. Select or enter scope
3. Enter commit description
4. Enter longer description (optional)
5. Enter breaking changes (optional)
6. Enter issues closed (optional)
7. Confirm commit

### Manual Commit

```bash
git commit -m "feat(api): add new endpoint for user profile"
```

### With Body and Footer

```bash
git commit -m "fix(auth): prevent session hijacking

Added CSRF token validation to all state-changing endpoints.

Fixes #234
Closes #567"
```

## Automatic Version Bumping

Once commits follow conventional commit format, automatic versioning works like this:

### Standard-Version

```bash
# Automatic version bump based on commits since last tag
npm run release

# Specify version type
npm run release:major     # 1.0.0 → 2.0.0
npm run release:minor     # 1.0.0 → 1.1.0
npm run release:patch     # 1.0.0 → 1.0.1
npm run release:beta      # 1.0.0 → 1.0.1-beta.0
```

### What Standard-Version Does

1. Analyzes commits since last tag
2. Determines version bump:
   - `feat` commits → MINOR bump
   - `fix` commits → PATCH bump
   - `BREAKING CHANGE` → MAJOR bump
3. Updates `package.json` version
4. Updates `CHANGELOG.md`
5. Creates git commit with new version
6. Creates git tag (e.g., `v1.1.0`)

## Commit Lint Validation

**CommitLint** validates commits against conventional commit rules:

```bash
# Automatic validation on commit (via git hook)
git commit -m "invalid commit"
# Error: commit message validation failed
```

**Rules enforced:**

- ✅ Type must be lowercase
- ✅ Type must be in allowed list
- ✅ Subject must not be empty
- ✅ Subject must not end with period
- ✅ Subject line max 72 characters
- ✅ Blank line before body
- ✅ Blank line before footer

## Release Workflow

### Step 1: Make Changes

```bash
git checkout -b feature/new-api-endpoint
# Make code changes
npm test
```

### Step 2: Commit Changes

```bash
npm run commit
# Or: commitizen (interactive)
```

### Step 3: Create Release

```bash
npm run release
# Or specify version: npm run release:minor
```

This automatically:

- Updates package.json version
- Updates CHANGELOG.md
- Creates version commit
- Creates git tag
- Ready to push

### Step 4: Push to Remote

```bash
git push origin feature-branch
git push origin v1.1.0
# Create GitHub Release from tag
```

## Integration with CI/CD

Standard-Version works well with GitHub Actions:

```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npm run release
      - run: git push origin main --tags
```

## Best Practices

### ✅ DO

- ✅ Use descriptive commit messages
- ✅ Use imperative mood (present tense)
- ✅ Reference issues in commits
- ✅ Group related changes in one commit
- ✅ Make commits atomic (one logical unit)
- ✅ Review commits before pushing

### ❌ DON'T

- ❌ Mix different concerns in one commit
- ❌ Use vague messages like "update" or "fix stuff"
- ❌ Commit before tests pass
- ❌ Include version bumps in regular commits
- ❌ Forget the scope (when applicable)
- ❌ Use capital letters in type or scope

## Examples of Good Commits

```
feat(api): add webhook support for async operations
fix(auth): validate JWT claims before processing
docs: update README with deployment guide
style(middleware): format code with prettier
refactor(services): extract common logic to utilities
perf(rate-limit): optimize counter lookups with Redis
test(api): add integration tests for new endpoints
chore(deps): upgrade Express to v4.19.0
ci: add GitHub Actions workflow for testing
revert: revert "feat(api): add webhook support"
```

## Examples of Bad Commits

```
✗ Updated stuff
✗ FIX BUGS
✗ Added new features and fixed bugs and updated docs
✗ WIP
✗ feat: added the feature
✗ fix - prevent error
```

## Troubleshooting

### Commit Rejected by CommitLint

**Issue:** `commit message validation failed`

**Solutions:**

- Check message follows format: `type(scope): description`
- Ensure type is lowercase and in allowed list
- Ensure description doesn't end with period
- Keep subject line under 72 characters

### Release Doesn't Bump Version

**Issue:** `npm run release` doesn't change version

**Solutions:**

- Check commits follow conventional commit format
- Ensure commits are based on last tag
- View commit history: `git log --oneline`
- Run with verbose: `npm run release -- --verbose`

### Can't Run Interactive Commit

**Issue:** `npm run commit` doesn't work

**Solutions:**

- Verify commitizen is installed: `npm list commitizen`
- Reinstall tools: `npm install`
- Try manual commit: `git commit -m "type: message"`

## Tools Installed

| Tool                                | Purpose                           | Version |
| ----------------------------------- | --------------------------------- | ------- |
| **commitizen**                      | Interactive commit prompt         | ^4.3.1  |
| **cz-conventional-changelog**       | Conventional commits plugin       | ^3.3.0  |
| **@commitlint/cli**                 | Commit message validation         | ^20.1.0 |
| **@commitlint/config-conventional** | Commitlint rules                  | ^20.0.0 |
| **standard-version**                | Automatic versioning from commits | ^9.5.0  |
| **husky**                           | Git hooks management              | ^9.1.7  |

## Configuration Files

| File                 | Purpose                        |
| -------------------- | ------------------------------ |
| `.commitlintrc.json` | Commitlint validation rules    |
| `.cz-config.js`      | Commitizen interactive options |
| `package.json`       | Release scripts and config     |
| `.husky/`            | Git hooks (prepare-commit-msg) |

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Standard Version](https://github.com/conventional-changelog/standard-version)
- [Commitizen](http://commitizen.github.io/cz-cli/)
- [CommitLint](https://commitlint.js.org/)

---

**With Conventional Commits, your version history is automatic and clear!** 🚀
