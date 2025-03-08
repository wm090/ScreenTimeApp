import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Clock, Settings, Bell, AlertTriangle } from "lucide-react";

interface AppUsageCardProps {
  appName?: string;
  appIcon?: string;
  usageTime?: number; // in minutes
  threshold?: number; // in minutes
  notificationCount?: number;
  status?: "normal" | "warning" | "critical";
}

const AppUsageCard = ({
  appName = "Instagram",
  appIcon = "https://api.dicebear.com/7.x/avataaars/svg?seed=instagram",
  usageTime = 45,
  threshold = 60,
  notificationCount = 3,
  status = "normal",
}: AppUsageCardProps) => {
  // Calculate percentage of threshold used
  const usagePercentage = Math.min(
    Math.round((usageTime / threshold) * 100),
    100,
  );

  // Determine status color
  const getStatusColor = () => {
    switch (status) {
      case "critical":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      default:
        return "text-green-500";
    }
  };

  // Determine progress color
  const getProgressColor = () => {
    if (usagePercentage >= 90) return "bg-red-500";
    if (usagePercentage >= 75) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <Card className="w-[330px] h-[180px] bg-white overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              <img
                src={appIcon}
                alt={appName}
                className="w-full h-full object-cover"
              />
            </div>
            <CardTitle className="text-lg">{appName}</CardTitle>
          </div>
          <div className={`flex items-center ${getStatusColor()}`}>
            {status === "critical" && (
              <AlertTriangle className="w-4 h-4 mr-1" />
            )}
            <span className="text-xs font-medium">
              {status === "critical"
                ? "Over limit"
                : status === "warning"
                  ? "Near limit"
                  : "Good"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>{usageTime} min</span>
            <span className="mx-1">/</span>
            <span>{threshold} min</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Bell className="w-4 h-4 mr-1" />
            <span>{notificationCount}</span>
          </div>
        </div>
        <Progress
          value={usagePercentage}
          className="h-2"
          // Apply custom color to the indicator
          style={
            {
              "--progress-color": getProgressColor(),
            } as React.CSSProperties
          }
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">{usagePercentage}%</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between w-full">
          <Button variant="outline" size="sm" className="text-xs">
            View Details
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Configure
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AppUsageCard;
