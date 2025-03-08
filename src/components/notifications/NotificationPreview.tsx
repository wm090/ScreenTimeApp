import React from "react";
import { Bell, AlertTriangle, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface NotificationPreviewProps {
  appName?: string;
  appIcon?: string;
  message?: string;
  intensityLevel?: "standard" | "persistent" | "full-screen";
  onDismiss?: () => void;
  onViewStats?: () => void;
}

const NotificationPreview = ({
  appName = "Instagram",
  appIcon = "https://api.dicebear.com/7.x/avataaars/svg?seed=instagram",
  message = "You've been scrolling for 45 minutes. Time for a break?",
  intensityLevel = "standard",
  onDismiss = () => {},
  onViewStats = () => {},
}: NotificationPreviewProps) => {
  return (
    <div className="w-[350px] bg-white p-4 rounded-lg shadow-lg">
      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="persistent">Persistent</TabsTrigger>
          <TabsTrigger value="full-screen">Full-screen</TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={appIcon}
                    alt={appName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{appName}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        <Bell className="w-3 h-3 mr-1" /> Standard
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={onDismiss}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm mt-2">{message}</p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={onDismiss}
                    >
                      Dismiss
                    </Button>
                    <Button size="sm" className="text-xs" onClick={onViewStats}>
                      View Stats
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="persistent">
          <Card className="border shadow-sm border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={appIcon}
                    alt={appName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{appName}</h3>
                      <Badge
                        variant="outline"
                        className="text-xs mt-1 border-amber-300 text-amber-700 bg-amber-100"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" /> Persistent
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={onDismiss}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm mt-2 font-medium">
                    {message} You're 15 minutes over your limit.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-amber-300"
                      onClick={onDismiss}
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs bg-amber-500 hover:bg-amber-600"
                      onClick={onViewStats}
                    >
                      View Stats
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="full-screen">
          <div className="relative">
            <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center z-10">
              <Card className="border-2 border-red-500 shadow-lg w-[90%] max-w-[300px] bg-white">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 mb-3">
                      <img
                        src={appIcon}
                        alt={appName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-base">{appName}</h3>
                    <Badge
                      variant="outline"
                      className="text-xs mt-1 mb-3 border-red-300 text-red-700 bg-red-100"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" /> Full-screen
                      Interruption
                    </Badge>
                    <p className="text-sm font-medium mb-4">
                      {message} You've spent 30 minutes over your daily limit!
                    </p>
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs flex-1 border-red-300"
                        onClick={onDismiss}
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="h-[200px] rounded-lg bg-gray-200 opacity-50">
              <div className="p-4">
                <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                <div className="w-3/4 h-4 bg-gray-300 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-gray-300 rounded"></div>
                  <div className="flex-1">
                    <div className="w-full h-3 bg-gray-300 rounded mb-1"></div>
                    <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationPreview;
