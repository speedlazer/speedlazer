#!/bin/bash
set -e

# Dry run
COMMIT_MSG=$(TZ=UTC git log -n 1 --format=format:"beta built from commit %h (%cd)" --date=local)
yarn build

# Clean up for release
git checkout gh-pages
git rm -r --ignore-unmatch beta

echo $COMMIT_MSG

# Move files to root
mv dist beta
git add beta

# publish

git commit -m "$COMMIT_MSG"

echo 'ready to be pushed / published!'

