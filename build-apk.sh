#!/bin/bash
cd android
./gradlew assembleRelease -x bundleReleaseJsAndAssets 2>&1 | tail -100
