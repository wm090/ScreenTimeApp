import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AndroidUsageStatsService } from "../../native/AndroidUsageStatsService";
import { AndroidNotificationService } from "../../native/AndroidNotificationService";

const AndroidNativeStoryboard = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [usageStats, setUsageStats] = useState<any[]>([]);
  const [installedApps, setInstalledApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check permission on component mount
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const permission = await AndroidUsageStatsService.hasPermission();
      setHasPermission(permission);
    } catch (error) {
      console.error("Error checking permission:", error);
    }
  };

  const requestPermission = async () => {
    try {
      const granted = await AndroidUsageStatsService.requestPermission();
      setHasPermission(granted);
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  };

  const fetchUsageStats = async () => {
    setIsLoading(true);
    try {
      const stats = await AndroidUsageStatsService.getUsageStats(7);
      setUsageStats(stats);
    } catch (error) {
      console.error("Error fetching usage stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInstalledApps = async () => {
    setIsLoading(true);
    try {
      const apps = await AndroidUsageStatsService.getInstalledApps();
      setInstalledApps(apps);
    } catch (error) {
      console.error("Error fetching installed apps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = async () => {
    try {
      await AndroidNotificationService.showUsageAlert({
        appName: "Instagram",
        message: "You've been using Instagram for too long!",
        usageTime: 45,
        threshold: 30,
        level: "standard",
      });
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  };

  const startMonitoring = async () => {
    try {
      const started = await AndroidUsageStatsService.startMonitoring();
      console.log("Monitoring started:", started);
    } catch (error) {
      console.error("Error starting monitoring:", error);
    }
  };

  const stopMonitoring = async () => {
    try {
      const stopped = await AndroidUsageStatsService.stopMonitoring();
      console.log("Monitoring stopped:", stopped);
    } catch (error) {
      console.error("Error stopping monitoring:", error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Android Native Features</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Permission Card */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Stats Permission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Status:{" "}
              {hasPermission === null
                ? "Unknown"
                : hasPermission
                  ? "Granted"
                  : "Not Granted"}
            </p>
            <Button onClick={requestPermission} className="mr-2">
              Request Permission
            </Button>
            <Button variant="outline" onClick={checkPermission}>
              Check Permission
            </Button>
          </CardContent>
        </Card>

        {/* Usage Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={fetchUsageStats}
              disabled={isLoading}
              className="mb-4"
            >
              {isLoading ? "Loading..." : "Fetch Usage Stats"}
            </Button>

            {usageStats.length > 0 && (
              <div className="mt-4 max-h-[200px] overflow-y-auto">
                {usageStats.map((stat, index) => (
                  <div key={index} className="mb-2 p-2 border rounded">
                    <p>
                      <strong>{stat.appName}</strong>
                    </p>
                    <p>
                      Usage:{" "}
                      {AndroidUsageStatsService.msToMinutes(stat.usageTimeMs)}{" "}
                      minutes
                    </p>
                    <p>
                      Last used: {new Date(stat.lastTimeUsed).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Installed Apps Card */}
        <Card>
          <CardHeader>
            <CardTitle>Installed Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={fetchInstalledApps}
              disabled={isLoading}
              className="mb-4"
            >
              {isLoading ? "Loading..." : "Fetch Installed Apps"}
            </Button>

            {installedApps.length > 0 && (
              <div className="mt-4 max-h-[200px] overflow-y-auto">
                {installedApps.map((app, index) => (
                  <div
                    key={index}
                    className="mb-2 p-2 border rounded flex items-center"
                  >
                    <img
                      src={app.icon}
                      alt={app.appName}
                      className="w-8 h-8 mr-2"
                    />
                    <div>
                      <p>
                        <strong>{app.appName}</strong>
                      </p>
                      <p className="text-xs text-gray-500">{app.packageName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Card */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={showNotification} className="mb-2 w-full">
              Show Test Notification
            </Button>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button onClick={startMonitoring} variant="outline">
                Start Monitoring
              </Button>
              <Button onClick={stopMonitoring} variant="outline">
                Stop Monitoring
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AndroidNativeStoryboard;
