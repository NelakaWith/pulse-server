#!/bin/bash
# Release Script for Pulse Server
# Usage: ./release.sh [major|minor|patch|premajor|preminor|prepatch] [prerelease-id]

set -e

VERSION_TYPE=${1:-minor}
PRERELEASE_ID=${2:-beta}

echo "🚀 Pulse Server Release Tool"
echo "================================"

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(major|minor|patch|premajor|preminor|prepatch)$ ]]; then
  echo "❌ Invalid version type: $VERSION_TYPE"
  echo "Valid options: major, minor, patch, premajor, preminor, prepatch"
  exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $CURRENT_VERSION"

# Determine new version
case $VERSION_TYPE in
  major)
    NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print ($1+1) ".0.0"}')
    ;;
  minor)
    NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1 "." ($2+1) ".0"}')
    ;;
  patch)
    NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1 "." $2 "." ($3+1)}')
    ;;
  premajor)
    NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print ($1+1) ".0.0-'$PRERELEASE_ID'.1"}')
    ;;
  preminor)
    NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1 "." ($2+1) ".0-'$PRERELEASE_ID'.1"}')
    ;;
  prepatch)
    NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1 "." $2 "." ($3+1) "-'$PRERELEASE_ID'.1"}')
    ;;
esac

echo "📝 New version: $NEW_VERSION"

# Confirm
read -p "Continue with release? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Release cancelled"
  exit 1
fi

# Update version
npm pkg set version=$NEW_VERSION
echo "✅ Version updated in package.json"

# Update CHANGELOG
echo "📋 Remember to update CHANGELOG.md"

# Create git tag
echo "🏷️ Creating git tag v$NEW_VERSION"
git tag -a v$NEW_VERSION -m "Release version $NEW_VERSION"

echo ""
echo "✅ Release prepared: v$NEW_VERSION"
echo ""
echo "Next steps:"
echo "  1. Update CHANGELOG.md with release notes"
echo "  2. git push origin v$NEW_VERSION"
echo "  3. Create GitHub Release with release notes"
echo ""
