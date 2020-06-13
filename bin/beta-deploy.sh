#!/bin/sh
set -e

# Dry run
COMMIT_MSG=$(TZ=UTC git log -n 1 --format=format:"beta built from commit %h (%cd)" --date=local)
TARGET_ENV=site
yarn build
mv dist dist_pub

# Clean up for release
git checkout gh-pages
git rm -r --ignore-unmatch beta

# Move files to root
mv dist_pub beta
git add beta

# publish

git commit --allow-empty -m "$COMMIT_MSG"

echo 'ready to be pushed / published!'

