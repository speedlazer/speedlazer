#!/bin/bash
set -e

grunt
rm -r dist
git checkout gh-pages
git rm dist/
git commit -m 'prepare for release'
git checkout master
grunt
git checkout gh-pages
git add dist/
git commit --amend -m 'game update'

echo 'ready to be pushed!'

