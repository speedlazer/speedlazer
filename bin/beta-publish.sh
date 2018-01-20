#!/bin/bash
set -e

# Dry run
yarn build
rm -r dist

# Clean up for release
git checkout gh-pages
git rm -r beta
git commit -m 'prepare for beta release'

# Buid project
git checkout -
COMMIT_MSG = $(TZ=UTC git log -n 1 --format=format:"beta built from commit %h (%cd)" --date=local)
yarn build
git checkout -

# Move files to root
rm -r beta
mv dist beta
git add beta

# publish

git commit --amend -m 'Automatic beta release'

echo 'ready to be pushed / published!'

