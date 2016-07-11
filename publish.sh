#!/bin/bash
set -e

grunt
rm -r dist
git checkout gh-pages
git rm -r dist/
git commit -m 'prepare for release'
git checkout master
grunt
git checkout gh-pages
git add dist/
git commit --amend

echo 'ready to be pushed!'

