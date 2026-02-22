#!/bin/bash
set -e

echo "🔨 בנייה של APK..."
cd android
./gradlew assembleRelease -x bundleReleaseJsAndAssets 2>&1 | grep -E "(BUILD|FAILURE|SUCCESS|apk|error)" | tail -20
cd ..

if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
  echo "✅ APK בנוי בהצלחה!"
  cp android/app/build/outputs/apk/release/app-release.apk /home/ubuntu/KablanWorker-release.apk
  ls -lh /home/ubuntu/KablanWorker-release.apk
else
  echo "❌ בנייה נכשלה"
  exit 1
fi
