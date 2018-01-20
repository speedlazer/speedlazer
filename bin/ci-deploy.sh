#!/bin/sh
set -e
git config user.name "Travis"
git config user.email "travis@travis-ci.org"
git remote add origin https://${GITHUB_TOKEN}@github.com/speedlazer/speedlazer.git > /dev/null 2>&1
bin/beta-deploy.sh
git push origin gh-pages
