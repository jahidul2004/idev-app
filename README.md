# iDev - Device Monitor

A modern React Native mobile app that collects and presents important device diagnostics in a clean dashboard UI.

![iDev Preview](https://i.ibb.co.com/mZ51bDH/image.png)

## Overview

iDev helps you quickly inspect device-level information from a single screen. It is useful for developers, QA engineers, and support teams who need fast visibility into hardware and system status during testing.

The app currently displays:

- Device identity (name, brand, manufacturer, model, unique ID)
- OS and build information (system name/version, build number, API level)
- Battery state (level and charging status)
- Memory and storage details (total/used/free)
- Network basics (IP address, carrier)
- Hardware and runtime state (ABI, camera availability, emulator/tablet flags)

## Tech Stack

- React Native 0.84.1
- React 19.2.3
- TypeScript
- Android Gradle + Kotlin
- iOS CocoaPods
- react-native-device-info for device/system metrics

## Requirements

### Node & JavaScript

- Node.js >= 22.11.0
- npm (comes with Node)

### Android

- Android Studio (latest stable)
- Android SDK with API level 36
- Android device or emulator (minSdkVersion 24)

### iOS (macOS only)

- Xcode (latest stable)
- CocoaPods

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start Metro in one terminal:

```bash
npm run start
```

3. Run on a platform:

```bash
# Android
npm run android

# iOS (macOS only)
npm run ios
```

## Available Scripts

- `npm run start` - starts Metro bundler
- `npm run android` - builds and launches Android app
- `npm run ios` - builds and launches iOS app
- `npm run lint` - runs ESLint
- `npm run test` - runs Jest tests

## Project Structure

```text
idev/
  src/
    App.tsx                 # Main dashboard UI and device data loading logic
  __tests__/
    App.test.tsx            # Basic render test
  android/                  # Android native project
  ios/                      # iOS native project
  app.json                  # App metadata (name/displayName)
  index.js                  # React Native app entry
  package.json              # Dependencies and scripts
```

## How Data Is Loaded

The app requests multiple device/system values in parallel using `Promise.all(...)` from `react-native-device-info`, then maps the result into logical groups:

- `device`
- `system`
- `battery`
- `memory`
- `storage`
- `network`
- `hardware`
- `deviceState`

This keeps rendering straightforward and makes future expansion easier.

## Troubleshooting

### Metro cache issues

```bash
npx react-native start --reset-cache
```

### Android build issues

```bash
cd android
./gradlew clean
cd ..
npm run android
```

On Windows PowerShell, use:

```powershell
cd android
.\gradlew.bat clean
cd ..
npm run android
```

### iOS pod issues (macOS)

```bash
cd ios
pod install
cd ..
npm run ios
```

## Notes

- iOS build commands require macOS.
- Some values may be unavailable on specific devices/OS versions and are shown as `N/A`.

## Roadmap Ideas

- Add live sensor streaming (accelerometer/gyroscope)
- Export diagnostics as JSON
- Add historical snapshots for comparison
- Introduce permissions and privacy controls per data category

## License

This project is currently unlicensed. Add a `LICENSE` file if you plan to distribute it publicly.
