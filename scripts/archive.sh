#!/bin/sh

if [ -e tmp ]; then
  rm -rf tmp
fi

mkdir -p tmp

cp -r build tmp
cp -r node_modules tmp
cp -r package.json tmp

pushd tmp
npm prune --production
asar pack . ../app.asar
popd

rm -rf tmp
