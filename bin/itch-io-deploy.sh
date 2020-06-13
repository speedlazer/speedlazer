#!/bin/sh
set -e

TARGET_ENV=itch yarn build

cd dist
zip -r -X ../speedlazer.zip *
cd -
