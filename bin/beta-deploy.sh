#!/bin/sh
set -e

# Dry run
COMMIT_MSG=$(TZ=UTC git log -n 1 --format=format:"beta built from commit %h (%cd)" --date=local)
yarn build
mv dist dist_pub

git status
git branch -r

# Clean up for release
git checkout origin/gh-pages
git rm -r --ignore-unmatch beta

echo $COMMIT_MSG

# Move files to root
mv dist_pub beta
git add beta

# publish

git commit -m "$COMMIT_MSG"

echo 'ready to be pushed / published!'

