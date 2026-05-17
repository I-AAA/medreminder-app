# MedReminder — Store Submission Guide

Everything you need to publish to Google Play and the Apple App Store.
Work through each section in order before submitting.

---

## Prerequisites

| Account | Cost | Where |
|---|---|---|
| Google Play Developer | $25 one-time | play.google.com/console |
| Apple Developer Program | $99/year | developer.apple.com |

---

## Part 1 — Android (Google Play)

### 1.1 Install build tools

1. Download and install **Android Studio** from developer.android.com/studio
2. During setup, accept the SDK licence and install the default SDK (API 34+)
3. Set the `ANDROID_HOME` environment variable to your SDK path  
   (typically `C:\Users\<you>\AppData\Local\Android\Sdk`)

### 1.2 Open the project

1. Open Android Studio → **Open an existing project**
2. Navigate to: `Medication Reminder App R2\android\`
3. Wait for Gradle sync to complete (first time takes 3–5 minutes)

### 1.3 Configure app signing

1. In Android Studio: **Build → Generate Signed Bundle / APK**
2. Choose **Android App Bundle (AAB)** — Google Play requires AAB
3. Create a new keystore:
   - Key store path: save somewhere safe outside the project (e.g. `C:\keys\medreminder.jks`)
   - Key alias: `medreminder`
   - Validity: 25 years
   - Fill in your name and organisation
4. **Save the keystore and passwords — you will need them for every future update. Losing them means you cannot update the app.**
5. Select **Release** build variant → Finish
6. AAB file will be at: `android\app\release\app-release.aab`

### 1.4 Update assetlinks.json

After generating your keystore, get the SHA256 fingerprint:

```
keytool -list -v -keystore C:\keys\medreminder.jks -alias medreminder
```

Copy the SHA256 value and replace `REPLACE_WITH_YOUR_SIGNING_CERTIFICATE_SHA256_FINGERPRINT`
in `public/.well-known/assetlinks.json`, then redeploy your website.

### 1.5 Create the Play Store listing

1. Go to play.google.com/console → **Create app**
2. Fill in:
   - **App name**: MedReminder
   - **Default language**: English (United States) — or your primary language
   - **App or game**: App
   - **Free or paid**: Free
3. Complete the **Store listing** section:
   - **Short description**: copy from `store-assets/android/short-description.txt`
   - **Full description**: copy from `store-assets/android/full-description.txt`
   - **App icon**: upload `public/icons/icon-512.png`
   - **Feature graphic**: create a 1024×500px banner (use Canva or Figma)
   - **Screenshots**: see `store-assets/screenshots/README.md`
4. **Content rating**: complete the questionnaire
   - Category: Health & Fitness
   - Answer NO to all sensitive content questions (violence, adult, etc.)
5. **Privacy policy URL**: your hosted `privacy.html` URL  
   (e.g. `https://yourusername.github.io/medreminder/privacy.html`)
6. **Data safety**: declare "No data collected or shared"

### 1.6 Upload and release

1. **Production → Create new release**
2. Upload the `.aab` file
3. Release notes: copy from `store-assets/android/release-notes-v1.txt`
4. **Submit for review** — Google typically reviews in 1–3 days

---

## Part 2 — iOS (App Store)

> **Requires a Mac with Xcode 15+.** You cannot build for iOS on Windows.
> If you don't have a Mac, consider using a Mac mini in a cloud service like MacStadium or GitHub Actions.

### 2.1 Transfer to Mac

Copy the entire `Medication Reminder App R2` folder to your Mac.
Then run in Terminal:

```bash
cd "Medication Reminder App R2"
npm install
npm run build
npx cap sync ios
```

### 2.2 Install CocoaPods (first time only)

```bash
sudo gem install cocoapods
cd ios/App
pod install
```

### 2.3 Open in Xcode

```bash
npx cap open ios
```

Or open `ios/App/App.xcworkspace` directly in Xcode (use `.xcworkspace`, not `.xcodeproj`).

### 2.4 Configure signing in Xcode

1. Select the **App** target → **Signing & Capabilities**
2. Set **Team** to your Apple Developer account
3. **Bundle Identifier**: `com.medreminder.app`
4. Xcode will create a provisioning profile automatically (requires Apple Developer account)

### 2.5 Add required Info.plist keys

In Xcode, open `App/App/Info.plist` and add:

| Key | Value |
|---|---|
| `NSUserNotificationsUsageDescription` | We use notifications to remind you to take your medications at your scheduled times. |
| `NSPhotoLibraryUsageDescription` | Used to let you attach a photo of your medication. |
| `NSCameraUsageDescription` | Used to take a photo of your medication directly. |

### 2.6 Build and Archive

1. Select **Any iOS Device (arm64)** as the build target
2. **Product → Archive**
3. In the Organiser window: **Distribute App → App Store Connect → Upload**

### 2.7 Create the App Store listing

1. Go to appstoreconnect.apple.com → **My Apps → +**
2. Fill in:
   - **Name**: MedReminder
   - **Bundle ID**: com.medreminder.app
   - **SKU**: MEDREMINDER001
3. In the app listing:
   - **Description**: copy from `store-assets/ios/description.txt`
   - **Keywords**: copy from `store-assets/ios/keywords.txt` (100 chars max)
   - **What's New**: copy from `store-assets/ios/whats-new-v1.txt`
   - **Privacy Policy URL**: your hosted `privacy.html` URL
   - **App icon**: 1024×1024px version of your icon (no transparency, no rounded corners — Apple rounds it)
   - **Screenshots**: see `store-assets/screenshots/README.md`
4. **Age rating**: 4+ (no objectionable content)
5. **Category**: Health & Fitness (primary), Medical (secondary)
6. Select the uploaded build and **Submit for Review**
   — Apple reviews in 1–3 days for standard submissions

---

## Part 3 — Screenshots

See `store-assets/screenshots/README.md` for the exact sizes required and tips on capturing them.

---

## Part 4 — After Launch

### Update workflow (both platforms)

```bash
# 1. Make changes to src/
npm run build
npx cap sync

# 2. Android: open Android Studio → Build → Generate Signed Bundle
# 3. iOS (on Mac): open Xcode → Archive → Distribute
```

### Update assetlinks.json after any key change

If you re-sign the Android app with a different key, update `public/.well-known/assetlinks.json`
and redeploy your website, or Android deep links will break.

---

## Quick Reference

| File | Purpose |
|---|---|
| `android/` | Android Studio project — open to build APK/AAB |
| `ios/App/App.xcworkspace` | Xcode project — open on Mac to build IPA |
| `capacitor.config.json` | Capacitor settings (app ID, web dir, plugins) |
| `public/.well-known/assetlinks.json` | Android app link verification (update SHA256) |
| `public/privacy.html` | Privacy policy — host this at a public URL |
| `store-assets/` | All text content for store listings |
| `dist/` | Production web build — regenerate with `npm run build` |
