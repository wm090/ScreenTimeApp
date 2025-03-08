/**
 * This file handles Android usage statistics.
 * In a real React Native app, this would use the UsageStatsManager API.
 */

import { AndroidBridge } from "./AndroidBridge";

export interface AppUsageData {
  packageName: string;
  appName: string;
  usageTimeMs: number;
  lastTimeUsed: number;
}

export interface AppInfo {
  packageName: string;
  appName: string;
  icon: string;
  category: string;
}

export class AndroidUsageStatsService {
  // Check if the app has usage stats permission
  static async hasPermission(): Promise<boolean> {
    return AndroidBridge.hasUsageStatsPermission();
  }

  // Request usage stats permission
  static async requestPermission(): Promise<boolean> {
    return AndroidBridge.requestUsageStatsPermission();
  }

  // Get usage stats for all apps
  static async getUsageStats(days: number = 7): Promise<AppUsageData[]> {
    return AndroidBridge.getAppUsageStats(days);
  }

  // Get usage stats for a specific app
  static async getAppUsageStats(
    packageName: string,
    days: number = 7,
  ): Promise<AppUsageData | null> {
    const allStats = await this.getUsageStats(days);
    return allStats.find((app) => app.packageName === packageName) || null;
  }

  // Get list of installed apps
  static async getInstalledApps(): Promise<AppInfo[]> {
    return AndroidBridge.getInstalledApps();
  }

  // Convert milliseconds to minutes
  static msToMinutes(ms: number): number {
    return Math.round(ms / (1000 * 60));
  }

  // Start monitoring app usage in the background
  static async startMonitoring(): Promise<boolean> {
    return AndroidBridge.startBackgroundService();
  }

  // Stop monitoring app usage
  static async stopMonitoring(): Promise<boolean> {
    return AndroidBridge.stopBackgroundService();
  }

  // Force close an app (requires special permissions)
  static async closeApp(packageName: string): Promise<boolean> {
    return AndroidBridge.closeApp(packageName);
  }
}
