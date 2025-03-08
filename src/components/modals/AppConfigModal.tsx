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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Bell, Clock, AlertTriangle, MessageSquare } from "lucide-react";

interface AppConfigModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  appName?: string;
  appIcon?: string;
  currentThreshold?: number;
  currentNotificationLevel?: "standard" | "persistent" | "full-screen";
  customMessages?: string[];
  isQuietHoursEnabled?: boolean;
}

const AppConfigModal = ({
  open = true,
  onOpenChange = () => {},
  appName = "Instagram",
  appIcon = "https://api.dicebear.com/7.x/avataaars/svg?seed=instagram",
  currentThreshold = 60,
  currentNotificationLevel = "standard",
  customMessages = [
    "Hey, you've been on Instagram for a while now.",
    "Time to take a break from scrolling!",
    "Your screen time limit has been reached.",
  ],
  isQuietHoursEnabled = false,
}: AppConfigModalProps) => {
  const [threshold, setThreshold] = useState(currentThreshold);
  const [notificationLevel, setNotificationLevel] = useState(
    currentNotificationLevel,
  );
  const [messages, setMessages] = useState(customMessages);
  const [newMessage, setNewMessage] = useState("");
  const [quietHours, setQuietHours] = useState(isQuietHoursEnabled);

  const handleAddMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage]);
      setNewMessage("");
    }
  };

  const handleRemoveMessage = (index: number) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              <img
                src={appIcon}
                alt={appName}
                className="w-full h-full object-cover"
              />
            </div>
            <DialogTitle className="text-xl">Configure {appName}</DialogTitle>
          </div>
          <DialogDescription>
            Set usage limits and notification preferences for {appName}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="limits" className="w-full mt-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="limits">
              <Clock className="w-4 h-4 mr-2" />
              Time Limits
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Custom Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="limits" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="threshold">Daily Time Limit</Label>
                  <span className="text-sm font-medium">
                    {threshold} minutes
                  </span>
                </div>
                <Slider
                  id="threshold"
                  min={5}
                  max={240}
                  step={5}
                  value={[threshold]}
                  onValueChange={(value) => setThreshold(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5 min</span>
                  <span>1 hour</span>
                  <span>2 hours</span>
                  <span>4 hours</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-1">
                  <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                  <p className="text-sm text-gray-500">
                    No notifications during set quiet hours
                  </p>
                </div>
                <Switch
                  id="quiet-hours"
                  checked={quietHours}
                  onCheckedChange={setQuietHours}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification-level">
                  Notification Intensity
                </Label>
                <Select
                  value={notificationLevel}
                  onValueChange={(
                    value: "standard" | "persistent" | "full-screen",
                  ) => setNotificationLevel(value)}
                >
                  <SelectTrigger id="notification-level">
                    <SelectValue placeholder="Select notification level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="persistent">Persistent</SelectItem>
                    <SelectItem value="full-screen">Full-screen</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  {notificationLevel === "standard"
                    ? "Regular notifications that can be easily dismissed"
                    : notificationLevel === "persistent"
                      ? "Notifications that require interaction to dismiss"
                      : "Full-screen interruptions that require action"}
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <Label>Notification Preview</Label>
                </div>
                <div
                  className={`p-4 rounded-lg border ${notificationLevel === "standard" ? "bg-gray-50" : notificationLevel === "persistent" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={appIcon}
                        alt={appName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">
                        {appName} Usage Alert
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {messages[0] || "You've reached your time limit."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-message">Add Custom Message</Label>
                <div className="flex gap-2 mt-1">
                  <Textarea
                    id="new-message"
                    placeholder="Enter a custom notification message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button
                    onClick={handleAddMessage}
                    className="flex-shrink-0 self-end"
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Messages</Label>
                {messages.length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between gap-2 p-3 rounded-md border bg-gray-50"
                      >
                        <p className="text-sm">{message}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMessage(index)}
                          className="h-6 w-6 p-0 text-gray-500"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No custom messages added yet
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppConfigModal;
