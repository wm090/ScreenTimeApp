import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Moon, Clock } from "lucide-react";

interface QuietHoursModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  enabled?: boolean;
  startTime?: string;
  endTime?: string;
  onSave?: (enabled: boolean, startTime: string, endTime: string) => void;
}

const QuietHoursModal = ({
  open = false,
  onOpenChange = () => {},
  enabled = false,
  startTime = "22:00",
  endTime = "07:00",
  onSave = () => {},
}: QuietHoursModalProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [quietHoursStart, setQuietHoursStart] = useState(startTime);
  const [quietHoursEnd, setQuietHoursEnd] = useState(endTime);

  const handleSave = () => {
    onSave(isEnabled, quietHoursStart, quietHoursEnd);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] bg-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Moon className="h-7 w-7 text-indigo-600" />
            <div>
              <DialogTitle className="text-xl">Quiet Hours</DialogTitle>
              <DialogDescription>
                Set times when you don't want to receive notifications
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuietHoursModal;
