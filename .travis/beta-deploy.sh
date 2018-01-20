#!/bin/sh
set -e
git config user.name "Travis"
git config user.email "travis@travis-ci.org"
echo "Setting remote"
git remote add origin-gh https://${GITHUB_TOKEN}@github.com/speedlazer/speedlazer.git > /dev/null 2>&1
git checkout origin-gh/gh-pages
git checkout -
echo "Starting build and deploy"
bin/beta-deploy.sh
echo "Pushing update to github pages"
git push origin-gh gh-pages
