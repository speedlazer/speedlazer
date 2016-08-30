#!/bin/bash
set -e

# Dry run
grunt
rm -r dist

# Clean up for release
git checkout gh-pages
git rm -r audio images index.html scripts styles dist
git commit -m 'prepare for release'

# Buid project
git checkout master
grunt
git checkout gh-pages

# Move files to root
mv dist dist2
cd dist2
mv * ..
cd ..
rm -r dist2
git add audio images index.html scripts styles dist

# publish

git commit --amend

echo 'ready to be pushed / published!'

