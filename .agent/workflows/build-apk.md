---
description: Build APK file for Android
---

# Build APK File

This workflow guides you through building an APK file for your Roblox coin app.

## Prerequisites

1. Make sure you have an Expo account
2. Install EAS CLI if not already installed:
   ```bash
   npm install -g eas-cli
   ```

## Steps

// turbo-all

1. **Login to EAS (if not already logged in)**
   ```bash
   eas login
   ```

2. **Configure the project (if first time)**
   ```bash
   eas build:configure
   ```

3. **Build the APK**
   ```bash
   eas build --platform android --profile apk
   ```

   This will:
   - Upload your project to Expo's build servers
   - Build an APK file (not AAB)
   - Provide a download link when complete

4. **Alternative: Build locally (faster, requires Android SDK)**
   ```bash
   eas build --platform android --profile apk --local
   ```

## Download the APK

Once the build completes, you'll receive:
- A download link in the terminal
- An email notification
- The APK will be available in your Expo dashboard at: https://expo.dev/accounts/[your-account]/projects/roblox/builds

## Install on Device

1. Download the APK file
2. Transfer to your Android device
3. Enable "Install from Unknown Sources" in Android settings
4. Tap the APK file to install

## Build Profiles

- `apk` - Builds an APK file for direct installation
- `production` - Builds an AAB file for Google Play Store
- `preview` - Internal testing build
- `development` - Development build with dev client
