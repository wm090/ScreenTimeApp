import React from "react";
import { Bell, AlertTriangle, X, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface AndroidNotificationProps {
  appName?: string;
  appIcon?: string;
  message?: string;
  usageTime?: number; // in minutes
  threshold?: number; // in minutes
  intensityLevel?: "standard" | "persistent" | "full-screen";
  onDismiss?: () => void;
  onViewStats?: () => void;
  onCloseApp?: () => void;
}

const AndroidNotification = ({
  appName = "Instagram",
  appIcon = "https://api.dicebear.com/7.x/avataaars/svg?seed=instagram",
  message = "You've been scrolling for 45 minutes. Time for a break?",
  usageTime = 45,
  threshold = 60,
  intensityLevel = "standard",
  onDismiss = () => {},
  onViewStats = () => {},
  onCloseApp = () => {},
}: AndroidNotificationProps) => {
  // Determine notification style based on intensity level
  const getNotificationStyle = () => {
    switch (intensityLevel) {
      case "persistent":
        return "border-amber-200 bg-amber-50";
      case "full-screen":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  // Calculate percentage of threshold used
  const usagePercentage = Math.min(
    Math.round((usageTime / threshold) * 100),
    100,
  );

  return (
    <Card
      className={`w-full max-w-[350px] shadow-lg ${getNotificationStyle()}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* App Icon */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={appIcon}
              alt={appName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{appName}</h3>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{usageTime} min</span>
                  <span className="mx-1">/</span>
                  <span>{threshold} min</span>
                  <span className="ml-1">({usagePercentage}%)</span>
                </div>
              </div>

              {/* Dismiss button */}
              {intensityLevel !== "full-screen" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={onDismiss}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Notification Badge */}
            <Badge
              variant="outline"
              className={`text-xs mt-2 ${intensityLevel === "persistent" ? "border-amber-300 text-amber-700 bg-amber-100" : intensityLevel === "full-screen" ? "border-red-300 text-red-700 bg-red-100" : ""}`}
            >
              {intensityLevel === "standard" ? (
                <>
                  <Bell className="w-3 h-3 mr-1" /> Usage Alert
                </>
              ) : intensityLevel === "persistent" ? (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" /> Warning
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" /> Critical
                </>
              )}
            </Badge>

            {/* Message */}
            <p
              className={`text-sm mt-2 ${intensityLevel !== "standard" ? "font-medium" : ""}`}
            >
              {message}
              {intensityLevel === "persistent" &&
                " You're over your time limit."}
              {intensityLevel === "full-screen" && " Please take a break now."}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              {intensityLevel === "full-screen" ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex-1 border-red-300"
                    onClick={onCloseApp}
                  >
                    Close App
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs flex-1 bg-red-500 hover:bg-red-600"
                    onClick={onViewStats}
                  >
                    View Stats
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`text-xs ${intensityLevel === "persistent" ? "border-amber-300" : ""}`}
                    onClick={onDismiss}
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    className={`text-xs ${intensityLevel === "persistent" ? "bg-amber-500 hover:bg-amber-600" : ""}`}
                    onClick={onViewStats}
                  >
                    View Stats
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AndroidNotification;
