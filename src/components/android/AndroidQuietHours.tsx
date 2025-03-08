import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Moon, Clock, Check } from "lucide-react";

interface TimeRange {
  start: string;
  end: string;
}

interface AndroidQuietHoursProps {
  enabled?: boolean;
  timeRange?: TimeRange;
  onSave?: (enabled: boolean, timeRange: TimeRange) => void;
  onCancel?: () => void;
}

const AndroidQuietHours = ({
  enabled = false,
  timeRange = { start: "22:00", end: "07:00" },
  onSave = () => {},
  onCancel = () => {},
}: AndroidQuietHoursProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [quietHoursStart, setQuietHoursStart] = useState(timeRange.start);
  const [quietHoursEnd, setQuietHoursEnd] = useState(timeRange.end);

  const handleSave = () => {
    onSave(isEnabled, {
      start: quietHoursStart,
      end: quietHoursEnd,
    });
  };

  return (
    <Card className="w-full max-w-[500px] bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Moon className="h-7 w-7 text-indigo-600" />
          <div>
            <CardTitle className="text-xl">Quiet Hours</CardTitle>
            <CardDescription>
              Set times when you don't want to receive notifications
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label
              htmlFor="quiet-hours-toggle"
              className="text-base font-medium"
            >
              Enable Quiet Hours
            </Label>
            <p className="text-sm text-gray-500">
              No notifications will be sent during these hours
            </p>
          </div>
          <Switch
            id="quiet-hours-toggle"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>

        <div className={isEnabled ? "" : "opacity-50 pointer-events-none"}>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-4">
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-indigo-900">How it works</h3>
                <p className="text-sm text-indigo-700 mt-1">
                  During quiet hours, the app will still track your usage but
                  won't send any notifications. All notifications will resume
                  once quiet hours end.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="start-time" className="block mb-2">
                Start Time
              </Label>
              <input
                id="start-time"
                type="time"
                value={quietHoursStart}
                onChange={(e) => setQuietHoursStart(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <Label htmlFor="end-time" className="block mb-2">
                End Time
              </Label>
              <input
                id="end-time"
                type="time"
                value={quietHoursEnd}
                onChange={(e) => setQuietHoursEnd(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Check className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AndroidQuietHours;
