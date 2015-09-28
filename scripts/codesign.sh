#!/bin/sh

codesign --deep --force --verbose --sign "Developer ID Application: KATSUMA TANAKA" dist/PopHub-darwin-x64/PopHub.app
codesign --verify -vvvv dist/PopHub-darwin-x64/PopHub.app
spctl -a -vvvv dist/PopHub-darwin-x64/PopHub.app
