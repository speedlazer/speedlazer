#!/bin/bash
set -e

# Dry run
grunt
rm -r dist

# Clean up for release
git checkout gh-pages
git rm -r audio images index.html scripts styles
git commit -m 'prepare for release'

# Buid project
git checkout master
grunt
git checkout gh-pages

# Move files to root
cd dist
mv * ..
cd ..
rm -r dist
git add audio images index.html scripts styles

# publish

git commit --amend

echo 'ready to be pushed / published!'

