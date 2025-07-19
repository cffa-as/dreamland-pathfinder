# Dreamland Pathfinder

A Next.js project with Capacitor integration for building a mobile app.

## Prerequisites

- Node.js 20 or higher
- JDK 21 for Android builds
- Android Studio for Android development

## Installation

```bash
# Install dependencies
npm install

# Add Android platform
npm run cap:add:android
```

## Development

```bash
# Start Next.js development server
npm run dev

# Build for production and export static files
npm run build

# Sync web code with native platforms
npm run cap:sync

# Open Android project in Android Studio
npm run cap:open:android
```

## GitHub Actions Deployment

This project is set up with GitHub Actions to automatically build:
1. The Next.js web application
2. The Android APK

The workflow addresses:
- Node.js version (20+) for Capacitor CLI
- gradlew permission issues
- JDK version (21) for Android builds

## Manual Setup Steps

### Initial Capacitor Setup

After installing dependencies:

```bash
npx cap init "Dreamland Pathfinder" "com.dreamland.pathfinder"
npm run build
npx cap add android
```

### Running on Android

```bash
npm run build
npm run cap:sync
npm run cap:open:android
```

Then build and run from Android Studio or:

```bash
cd android
./gradlew assembleDebug
``` 