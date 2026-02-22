#!/bin/bash
set -e

echo "🔨 בנייה של APK..."

cd android

# Try to build
if ./gradlew assembleRelease 2>&1 | tee build.log | grep -q "BUILD SUCCESSFUL"; then
    echo "✅ בנייה הצליחה!"
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_PATH" ]; then
        cp "$APK_PATH" /home/ubuntu/KablanWorker-app.apk
        echo "✅ קובץ APK מוכן!"
        ls -lh /home/ubuntu/KablanWorker-app.apk
        exit 0
    fi
else
    echo "❌ בנייה נכשלה - בדוק את ה-logs"
    tail -50 build.log
    exit 1
fi
