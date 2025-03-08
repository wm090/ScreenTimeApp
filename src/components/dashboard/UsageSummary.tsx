import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock, Calendar, Bell, BarChart3 } from "lucide-react";

interface UsageSummaryProps {
  totalScreenTime?: number; // in minutes
  dailyAverage?: number; // in minutes
  monitoredApps?: number;
  notificationsSent?: number;
  weeklyChange?: number; // percentage
}

const UsageSummary = ({
  totalScreenTime = 187,
  dailyAverage = 62,
  monitoredApps = 5,
  notificationsSent = 12,
  weeklyChange = -8,
}: UsageSummaryProps) => {
  // Format time to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Determine if weekly change is positive or negative
  const isPositiveChange = weeklyChange <= 0; // Negative change is good (less screen time)

  return (
    <div className="w-full max-w-[1400px] bg-white p-4 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Screen Time */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Total Screen Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">
                {formatTime(totalScreenTime)}
              </span>
              <div className="flex items-center mt-2 text-sm">
                <span
                  className={`font-medium ${isPositiveChange ? "text-green-500" : "text-red-500"}`}
                >
                  {weeklyChange > 0 ? "+" : ""}
                  {weeklyChange}%
                </span>
                <span className="text-gray-500 ml-2">vs last week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Average */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Daily Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">
                {formatTime(dailyAverage)}
              </span>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span>Across all monitored apps</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monitored Apps */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Monitored Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{monitoredApps}</span>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span>Active monitoring enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Sent */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notifications Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{notificationsSent}</span>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span>Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsageSummary;
