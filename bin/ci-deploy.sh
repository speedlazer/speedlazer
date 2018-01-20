#!/bin/sh
set -e
git config user.name "Travis"
git config user.email "travis@travis-ci.org"
bin/beta-deploy.sh
git push origin gh-pages
