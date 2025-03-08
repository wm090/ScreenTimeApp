import React, { useState } from "react";
import { Bell, Settings, Plus, Smartphone, LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import UsageSummary from "../dashboard/UsageSummary";
import AppUsageList from "../dashboard/AppUsageList";
import UsageTrends from "../dashboard/UsageTrends";
import AppConfigModal from "../modals/AppConfigModal";
import AndroidNotification from "./AndroidNotification";
import AndroidAppPermissions from "./AndroidAppPermissions";
import AndroidAppSelector from "./AndroidAppSelector";
import { useAuth } from "../auth/AuthProvider";

const AndroidHome = () => {
  const { nickname, signOut } = useAuth();
  const [isAppConfigModalOpen, setIsAppConfigModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(true);
  const [isAppSelectorOpen, setIsAppSelectorOpen] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showNotificationDemo, setShowNotificationDemo] = useState(false);
  const [notificationLevel, setNotificationLevel] = useState<
    "standard" | "persistent" | "full-screen"
  >("standard");

  // Mock data for total screen time stats
  const usageSummaryData = {
    totalScreenTime: 187, // in minutes
    dailyAverage: 62, // in minutes
    monitoredApps: 5,
    notificationsSent: 12,
    weeklyChange: -8, // percentage (negative is good - less screen time)
  };

  // Mock data for app usage
  const appUsageData = [
    {
      id: "1",
      appName: "Instagram",
      appIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=instagram",
      usageTime: 45,
      threshold: 60,
      notificationCount: 3,
      status: "normal",
      category: "social",
    },
    {
      id: "2",
      appName: "TikTok",
      appIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=tiktok",
      usageTime: 85,
      threshold: 90,
      notificationCount: 5,
      status: "warning",
      category: "social",
    },
    {
      id: "3",
      appName: "YouTube",
      appIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=youtube",
      usageTime: 120,
      threshold: 100,
      notificationCount: 8,
      status: "critical",
      category: "entertainment",
    },
  ];

  // Handle opening the app config modal
  const handleOpenAppConfig = (app = null) => {
    setSelectedApp(app);
    setIsAppConfigModalOpen(true);
  };

  // Handle permission request
  const handleRequestPermissions = () => {
    // In a real app, this would trigger Android permission requests
    setPermissionsGranted(true);
    setTimeout(() => {
      setIsPermissionsModalOpen(false);
      setIsAppSelectorOpen(true);
    }, 1500);
  };

  // Handle app selection
  const handleAppSelection = (selectedApps: string[]) => {
    console.log("Selected apps:", selectedApps);
    setIsAppSelectorOpen(false);
  };

  // Toggle notification demo
  const toggleNotificationDemo = (
    level: "standard" | "persistent" | "full-screen",
  ) => {
    setNotificationLevel(level);
    setShowNotificationDemo(true);
  };

  // Simple header component
  const AndroidHeader = () => {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Smartphone className="h-6 w-6 mr-2 text-blue-600" />
            <h1 className="text-xl font-bold">App Usage Monitor</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center mr-2 bg-blue-50 px-3 py-1 rounded-full">
              <User className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm font-medium">{nickname}</span>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 text-red-500"
              onClick={signOut}
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <AndroidHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Permissions Modal */}
        {isPermissionsModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <AndroidAppPermissions
              permissionsGranted={permissionsGranted}
              onRequestPermission={handleRequestPermissions}
              onSkip={() => {
                setIsPermissionsModalOpen(false);
                setIsAppSelectorOpen(true);
              }}
            />
          </div>
        )}

        {/* App Selector Modal */}
        {isAppSelectorOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <AndroidAppSelector
              onSave={handleAppSelection}
              onCancel={() => setIsAppSelectorOpen(false)}
            />
          </div>
        )}

        <div className="flex flex-col space-y-6">
          {/* Usage Summary */}
          <section>
            <UsageSummary
              totalScreenTime={usageSummaryData.totalScreenTime}
              dailyAverage={usageSummaryData.dailyAverage}
              monitoredApps={usageSummaryData.monitoredApps}
              notificationsSent={usageSummaryData.notificationsSent}
              weeklyChange={usageSummaryData.weeklyChange}
            />
          </section>

          {/* App Usage List */}
          <section>
            <AppUsageList
              apps={appUsageData}
              onAddApp={() => setIsAppSelectorOpen(true)}
              onFilterChange={(filter) =>
                console.log("Filter changed:", filter)
              }
              onSortChange={(sort) => console.log("Sort changed:", sort)}
              onSearch={(query) => console.log("Search query:", query)}
            />
          </section>

          {/* Usage Trends */}
          <section>
            <UsageTrends />
          </section>

          {/* Android Notification Demo */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Android Notification Preview
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              These are examples of the notifications that will appear on your
              Android device when you exceed your set time limits.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => toggleNotificationDemo("standard")}
              >
                Standard Alert
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleNotificationDemo("persistent")}
              >
                Persistent Warning
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleNotificationDemo("full-screen")}
              >
                Full-screen Interruption
              </Button>
            </div>

            {showNotificationDemo && (
              <div className="mt-6 flex justify-center">
                <AndroidNotification
                  appName="Instagram"
                  appIcon="https://api.dicebear.com/7.x/avataaars/svg?seed=instagram"
                  message="You've been scrolling for 45 minutes."
                  usageTime={45}
                  threshold={60}
                  intensityLevel={notificationLevel}
                  onDismiss={() => setShowNotificationDemo(false)}
                  onViewStats={() => console.log("View stats clicked")}
                  onCloseApp={() => setShowNotificationDemo(false)}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modals */}
      <AppConfigModal
        open={isAppConfigModalOpen}
        onOpenChange={setIsAppConfigModalOpen}
        appName={selectedApp?.appName || "New App"}
        appIcon={
          selectedApp?.appIcon ||
          "https://api.dicebear.com/7.x/avataaars/svg?seed=app"
        }
        currentThreshold={selectedApp?.threshold || 60}
        currentNotificationLevel="standard"
        customMessages={[
          "Hey, you've been on this app for a while now.",
          "Time to take a break from scrolling!",
          "Your screen time limit has been reached.",
        ]}
        isQuietHoursEnabled={false}
      />

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsAppSelectorOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default AndroidHome;
