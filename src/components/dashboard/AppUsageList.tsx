import React, { useState } from "react";
import { Search, Filter, PlusCircle, ArrowUpDown } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AppUsageCard from "./AppUsageCard";

interface AppData {
  id: string;
  appName: string;
  appIcon: string;
  usageTime: number; // in minutes
  threshold: number; // in minutes
  notificationCount: number;
  status: "normal" | "warning" | "critical";
  category: string;
}

interface AppUsageListProps {
  apps?: AppData[];
  onAddApp?: () => void;
  onFilterChange?: (filter: string) => void;
  onSortChange?: (sort: string) => void;
  onSearch?: (query: string) => void;
}

const AppUsageList = ({
  apps = [
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
    {
      id: "4",
      appName: "Twitter",
      appIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=twitter",
      usageTime: 30,
      threshold: 60,
      notificationCount: 1,
      status: "normal",
      category: "social",
    },
    {
      id: "5",
      appName: "Netflix",
      appIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=netflix",
      usageTime: 70,
      threshold: 120,
      notificationCount: 2,
      status: "normal",
      category: "entertainment",
    },
  ],
  onAddApp = () => {},
  onFilterChange = () => {},
  onSortChange = () => {},
  onSearch = () => {},
}: AppUsageListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("usage-high");
  const [activeTab, setActiveTab] = useState("all");

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    onFilterChange(value);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setActiveSort(value);
    onSortChange(value);
  };

  // Filter apps based on active tab
  const getFilteredApps = () => {
    if (activeTab === "all") return apps;
    if (activeTab === "critical")
      return apps.filter((app) => app.status === "critical");
    if (activeTab === "warning")
      return apps.filter((app) => app.status === "warning");
    if (activeTab === "normal")
      return apps.filter((app) => app.status === "normal");
    return apps;
  };

  const filteredApps = getFilteredApps();

  // Add App Button Component (inline since the import was causing issues)
  const AddAppButton = ({ onClick = () => {} }) => {
    return (
      <div
        className="w-[330px] h-[180px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={onClick}
      >
        <PlusCircle className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-gray-600 font-medium">Add New App</p>
        <p className="text-gray-400 text-sm mt-1">
          Configure monitoring settings
        </p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-4">
        {/* Header with title and controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold">Monitored Applications</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search apps..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8 w-full"
              />
            </div>

            {/* Filter dropdown */}
            <div className="flex gap-2">
              <Select value={activeFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort dropdown */}
              <Select value={activeSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[130px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usage-high">Usage (High-Low)</SelectItem>
                  <SelectItem value="usage-low">Usage (Low-High)</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabs for filtering by status */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="critical" className="text-red-500">
              Critical
            </TabsTrigger>
            <TabsTrigger value="warning" className="text-amber-500">
              Warning
            </TabsTrigger>
            <TabsTrigger value="normal" className="text-green-500">
              Normal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApps.map((app) => (
                <AppUsageCard
                  key={app.id}
                  appName={app.appName}
                  appIcon={app.appIcon}
                  usageTime={app.usageTime}
                  threshold={app.threshold}
                  notificationCount={app.notificationCount}
                  status={app.status}
                />
              ))}
              <AddAppButton onClick={onAddApp} />
            </div>
          </TabsContent>

          <TabsContent value="critical" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApps.map((app) => (
                <AppUsageCard
                  key={app.id}
                  appName={app.appName}
                  appIcon={app.appIcon}
                  usageTime={app.usageTime}
                  threshold={app.threshold}
                  notificationCount={app.notificationCount}
                  status={app.status}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="warning" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApps.map((app) => (
                <AppUsageCard
                  key={app.id}
                  appName={app.appName}
                  appIcon={app.appIcon}
                  usageTime={app.usageTime}
                  threshold={app.threshold}
                  notificationCount={app.notificationCount}
                  status={app.status}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="normal" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApps.map((app) => (
                <AppUsageCard
                  key={app.id}
                  appName={app.appName}
                  appIcon={app.appIcon}
                  usageTime={app.usageTime}
                  threshold={app.threshold}
                  notificationCount={app.notificationCount}
                  status={app.status}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Empty state when no apps match filters */}
        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-4 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No apps found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={onAddApp} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New App
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppUsageList;
