#!/bin/sh
set -e

TARGET_ENV=itch yarn build

cd dist
zip -rXoqdgds 1m ../speedlazer.zip *
cd ..
echo "speedlazer.zip is ready for upload to itch.io"
