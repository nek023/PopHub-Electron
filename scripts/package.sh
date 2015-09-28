#!/bin/sh

electron-packager . PopHub --platform=darwin --arch=x64 --version=0.32.3 --app-bundle-id=jp.questbeat.pophub-electron --app-version=0.0.1 --icon=pophub.icns --ignore="src|dist|scripts|gulpfile\\.js|pophub\\.icns|screenshot\\.png" --out=dist/ --prune --overwrite --asar
