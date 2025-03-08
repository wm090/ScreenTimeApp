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
import { Input } from "../ui/input";
import { Search, Plus, Check } from "lucide-react";

interface AppItem {
  id: string;
  name: string;
  icon: string;
  isSelected: boolean;
  category: string;
}

interface AndroidAppSelectorProps {
  onSave?: (selectedApps: string[]) => void;
  onCancel?: () => void;
}

const AndroidAppSelector = ({
  onSave = () => {},
  onCancel = () => {},
}: AndroidAppSelectorProps) => {
  // Sample list of installed apps
  const [installedApps, setInstalledApps] = useState<AppItem[]>([
    {
      id: "1",
      name: "Instagram",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=instagram",
      isSelected: false,
      category: "social",
    },
    {
      id: "2",
      name: "TikTok",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=tiktok",
      isSelected: false,
      category: "social",
    },
    {
      id: "3",
      name: "YouTube",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=youtube",
      isSelected: false,
      category: "entertainment",
    },
    {
      id: "4",
      name: "Twitter",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=twitter",
      isSelected: false,
      category: "social",
    },
    {
      id: "5",
      name: "Netflix",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=netflix",
      isSelected: false,
      category: "entertainment",
    },
    {
      id: "6",
      name: "Facebook",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=facebook",
      isSelected: false,
      category: "social",
    },
    {
      id: "7",
      name: "WhatsApp",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=whatsapp",
      isSelected: false,
      category: "communication",
    },
    {
      id: "8",
      name: "Snapchat",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=snapchat",
      isSelected: false,
      category: "social",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  // Toggle app selection
  const toggleAppSelection = (appId: string) => {
    setInstalledApps(
      installedApps.map((app) =>
        app.id === appId ? { ...app, isSelected: !app.isSelected } : app,
      ),
    );
  };

  // Filter apps based on search query
  const filteredApps = installedApps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get selected app IDs for saving
  const getSelectedAppIds = () => {
    return installedApps.filter((app) => app.isSelected).map((app) => app.id);
  };

  return (
    <Card className="w-full max-w-[500px] bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Select Apps to Monitor</CardTitle>
        <CardDescription>
          Choose which applications you want to track usage time for
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search installed apps..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* App list */}
        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div
                key={app.id}
                className={`flex items-center p-3 rounded-lg border ${app.isSelected ? "border-blue-200 bg-blue-50" : "border-gray-200"} cursor-pointer hover:bg-gray-50`}
                onClick={() => toggleAppSelection(app.id)}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 mr-3">
                  <img
                    src={app.icon}
                    alt={app.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{app.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">
                    {app.category}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${app.isSelected ? "bg-blue-500" : "border-2 border-gray-300"}`}
                >
                  {app.isSelected && <Check className="h-4 w-4 text-white" />}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No apps found matching your search
            </div>
          )}
        </div>

        {/* Selected count */}
        <div className="text-sm text-gray-600 text-center">
          {installedApps.filter((app) => app.isSelected).length} apps selected
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(getSelectedAppIds())}>
          <Plus className="h-4 w-4 mr-2" />
          Add Selected Apps
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AndroidAppSelector;
