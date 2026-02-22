# קבלן שלד - אפליקציית עובד מובייל

## 📱 אפליקציה לעובדים ב-Android ו-iOS

אפליקציה מובייל מלאה עבור עובדי קבלן שלד עם כל הכלים הדרושים לניהול יום עבודה.

---

## ✨ תכונות

### 🏠 לוח בקרה (Home)
- ✅ כפתור **התחל עבודה** (ירוק)
- ✅ כפתור **סיים עבודה** (אדום)
- ✅ טיימר בזמן אמת המראה כמה זמן עבדת
- ✅ סטטוס עבודה (עובד / לא עובד)
- ✅ רשימת משימות היום

### 📋 משימות (Tasks)
- ✅ רשימת משימות יומיות
- ✅ סטטוס משימה (ממתינה, בביצוע, הושלמה)
- ✅ עדיפות משימה (דחוף, בינוני, נמוך)
- ✅ כפתורים להתחלה וסיום משימה

### 📷 תמונות (Photos)
- ✅ צילום תמונה ישירה מהמצלמה
- ✅ בחירת תמונה מגלריית הטלפון
- ✅ הוספת הערה לתמונה
- ✅ מחיקת תמונות

### 📊 דוחות הכנסה (Reports)
- ✅ סה"כ הכנסה
- ✅ שעות עבודה
- ✅ שכר לשעה
- ✅ פילטור לפי תקופה (יומי, שבועי, חודשי)
- ✅ הורדת דוח PDF

---

## 🚀 התקנה והרצה

### דרישות
- Node.js 18+
- Android Studio (ל-Android)
- Xcode (ל-iOS, Mac בלבד)

### התקנה מקומית

```bash
# 1. הורדת הקוד
git clone https://github.com/your-username/KablanWorker.git
cd KablanWorker

# 2. התקנת תלויות
npm install

# 3. הרצה ב-Android
npm run android

# 4. הרצה ב-iOS (Mac בלבד)
npm run ios
```

---

## 📦 בנייה ל-Production

### Android APK

```bash
# 1. Bundle JavaScript
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# 2. בנייה של APK
cd android
./gradlew assembleRelease

# 3. APK יהיה ב:
# android/app/build/outputs/apk/release/app-release.apk
```

### iOS IPA

```bash
# 1. התקנת Pods
cd ios
pod install

# 2. בנייה של Archive
xcodebuild -workspace KablanWorker.xcworkspace \
  -scheme KablanWorker \
  -configuration Release \
  -derivedDataPath build \
  -archivePath build/KablanWorker.xcarchive \
  archive

# 3. Export IPA
xcodebuild -exportArchive \
  -archivePath build/KablanWorker.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/ipa
```

---

## 🔧 GitHub Actions (בנייה אוטומטית)

הפרויקט כולל GitHub Actions workflow שבונה APK ו-IPA אוטומטית בכל push.

### הגדרה:

1. **העלה את הקוד ל-GitHub**
```bash
git remote add origin https://github.com/your-username/KablanWorker.git
git push -u origin main
```

2. **GitHub Actions יבנה אוטומטית**
   - בנייה של APK ל-Android
   - בנייה של IPA ל-iOS
   - הורדה של הקבצים מ-Artifacts

---

## 📲 הורדה ל-Devices

### Android
1. הורדת `app-release.apk` מ-GitHub Actions
2. העברה לטלפון Android
3. פתיחת הקובץ והתקנה

### iOS
1. הורדת `KablanWorker.ipa` מ-GitHub Actions
2. שימוש ב-Apple Configurator או Xcode
3. התקנה על iPhone

---

## 🔌 חיבור לשרת

כרגע האפליקציה משתמשת בנתונים מדומים.

### כדי לחבר לשרת האמיתי:

1. **עדכן את API URL** ב-`App.tsx`:
```typescript
const API_URL = 'https://your-server.com/api/trpc';
```

2. **הוסף Authentication**:
```typescript
const authToken = await AsyncStorage.getItem('authToken');
```

3. **החלף נתונים מדומים בקריאות API**:
```typescript
const tasks = await fetch(`${API_URL}/tasks.list`);
```

---

## 📋 מבנה הפרויקט

```
KablanWorker/
├── App.tsx                 # אפליקציה ראשית
├── android/               # קוד Android
│   ├── app/build.gradle   # הגדרות בנייה
│   └── gradlew            # Gradle wrapper
├── ios/                   # קוד iOS
│   ├── KablanWorker.xcodeproj/
│   └── Podfile
├── package.json           # תלויות
└── .github/workflows/     # GitHub Actions
    └── build.yml          # בנייה אוטומטית
```

---

## 🛠️ Troubleshooting

### בעיה: "Gradle requires JVM 17 or later"
**פתרון**: התקן Java 17+
```bash
sudo apt-get install openjdk-17-jdk
```

### בעיה: "Pod install failed"
**פתרון**: 
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
```

### בעיה: "Metro bundler not starting"
**פתרון**:
```bash
npm start -- --reset-cache
```

---

## 📞 תמיכה

לשאלות או בעיות:
1. בדוק את ה-logs
2. נסה `npm install` מחדש
3. נקה את cache: `npm run reset-project`

---

## 📄 License

MIT License

---

## 🎯 הצעדים הבאים

- [ ] חיבור לשרת האמיתי
- [ ] הוספת GPS tracking
- [ ] הוספת Push Notifications
- [ ] בדיקה על טלפון אמיתי
- [ ] שיפור ה-UX בהתאם לתגובות
- [ ] העלאה ל-App Store ו-Google Play
