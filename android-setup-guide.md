# Android App Setup Guide

## Testing the App on an Android Device

To test and run this app on an Android device, you'll need to follow these steps:

### 1. Set up React Native

This app is currently built as a web application. To run it on Android, you need to convert it to a React Native application:

```bash
# Install React Native CLI if you haven't already
npm install -g react-native-cli

# Create a new React Native project
npx react-native init AppUsageMonitor
```

### 2. Port the UI Components

The current web components need to be ported to React Native:

- Replace HTML elements with React Native components (View, Text, TouchableOpacity, etc.)
- Replace Tailwind CSS with React Native StyleSheet
- Use React Native's built-in components or libraries like React Native Paper for UI elements

### 3. Implement Android-specific APIs

To monitor app usage on Android, you'll need to implement native modules:

```javascript
// Example of how to create a native module bridge in React Native
// This would be implemented in Java/Kotlin on the Android side
import { NativeModules } from 'react-native';
const { UsageStatsModule } = NativeModules;

// Then use it in your JS code
UsageStatsModule.getAppUsageStats(days)
  .then(stats => console.log(stats))
  .catch(error => console.error(error));
```

### 4. Required Android Permissions

In your `AndroidManifest.xml`, add these permissions:

```xml
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" tools:ignore="ProtectedPermissions" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### 5. Implement Background Service

Create a foreground service in Android to monitor app usage in the background:

```java
// This would be implemented in Java/Kotlin
public class UsageMonitorService extends Service {
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Create notification channel and start as foreground service
        startForeground(NOTIFICATION_ID, buildNotification());
        
        // Start monitoring app usage
        startMonitoring();
        
        return START_STICKY;
    }
    
    // Other required methods...
}
```

### 6. Supabase Integration

Your Supabase connection is already set up. Make sure to:

1. Create the necessary tables in Supabase:
   - `app_usage` - to store usage data
   - `app_config` - to store app-specific settings
   - `user_settings` - to store user preferences like quiet hours

2. Use the Supabase client in your React Native app:

```javascript
import { supabase } from './lib/supabase';
import { saveAppUsage } from './lib/supabaseService';

// Example usage
saveAppUsage(userId, 'com.instagram.android', 45);
```

### 7. Testing on a Device

1. Connect your Android device via USB
2. Enable USB debugging in developer options
3. Run:

```bash
npx react-native run-android
```

### 8. Building an APK

To create an installable APK:

```bash
cd android
./gradlew assembleRelease
```

The APK will be in `android/app/build/outputs/apk/release/app-release.apk`

## Important Notes

1. The UsageStatsManager API requires special permissions that users must grant through the system settings, not just through a runtime permission dialog.

2. Background services on modern Android versions have restrictions. You'll need to implement a foreground service with a persistent notification.

3. Different Android versions have different restrictions on background processing and battery optimization. Make sure to test on various Android versions.

4. For production, consider using Firebase for more reliable background processing and notifications.
