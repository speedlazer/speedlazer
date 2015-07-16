#!/bin/bash
set -e

grunt
git checkout gh-pages
git rm "$(git ls-files dist/scripts/*.combined-scripts.js)"
git rm "$(git ls-files dist/styles/*.main.css)"
git add dist/

git status

echo 'ready to be committed!'

