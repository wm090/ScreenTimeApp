import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BarChart, LineChart, PieChart, Activity } from "lucide-react";

interface UsageTrendsProps {
  data?: {
    daily?: {
      labels: string[];
      datasets: {
        name: string;
        data: number[];
        color: string;
      }[];
    };
    weekly?: {
      labels: string[];
      datasets: {
        name: string;
        data: number[];
        color: string;
      }[];
    };
    monthly?: {
      labels: string[];
      datasets: {
        name: string;
        data: number[];
        color: string;
      }[];
    };
  };
}

const UsageTrends = ({ data }: UsageTrendsProps) => {
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("line");

  // Default data if none provided
  const defaultData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          name: "Instagram",
          data: [45, 52, 38, 65, 42, 78, 63],
          color: "#E1306C",
        },
        {
          name: "TikTok",
          data: [30, 40, 45, 50, 55, 60, 45],
          color: "#00F2EA",
        },
        {
          name: "YouTube",
          data: [60, 55, 70, 45, 75, 80, 65],
          color: "#FF0000",
        },
      ],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          name: "Instagram",
          data: [320, 280, 305, 350],
          color: "#E1306C",
        },
        {
          name: "TikTok",
          data: [250, 290, 310, 275],
          color: "#00F2EA",
        },
        {
          name: "YouTube",
          data: [400, 420, 380, 450],
          color: "#FF0000",
        },
      ],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          name: "Instagram",
          data: [1200, 1300, 1100, 1400, 1250, 1350],
          color: "#E1306C",
        },
        {
          name: "TikTok",
          data: [900, 950, 1000, 1050, 1100, 1150],
          color: "#00F2EA",
        },
        {
          name: "YouTube",
          data: [1500, 1600, 1450, 1700, 1550, 1650],
          color: "#FF0000",
        },
      ],
    },
  };

  const trendsData = data || defaultData;

  // Render chart based on type
  const renderChart = (periodData: typeof trendsData.daily) => {
    // This is a placeholder for actual chart rendering
    // In a real implementation, you would use a charting library like recharts or chart.js
    return (
      <div className="h-[180px] w-full bg-white flex items-center justify-center relative">
        {chartType === "bar" && (
          <div className="w-full h-full p-4 flex items-end justify-between">
            {periodData.labels.map((label, index) => (
              <div key={label} className="flex flex-col items-center">
                <div className="flex space-x-1">
                  {periodData.datasets.map((dataset) => (
                    <div
                      key={dataset.name}
                      className="w-4 rounded-t-sm"
                      style={{
                        backgroundColor: dataset.color,
                        height: `${(dataset.data[index] / Math.max(...dataset.data)) * 120}px`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs mt-1">{label}</span>
              </div>
            ))}
          </div>
        )}

        {chartType === "line" && (
          <div className="w-full h-full p-4 relative">
            <svg className="w-full h-full" viewBox="0 0 400 150">
              {periodData.datasets.map((dataset, datasetIndex) => {
                const maxValue = Math.max(...dataset.data);
                const points = dataset.data
                  .map((value, index) => {
                    const x =
                      (index / (periodData.labels.length - 1)) * 380 + 10;
                    const y = 140 - (value / maxValue) * 120;
                    return `${x},${y}`;
                  })
                  .join(" ");

                return (
                  <polyline
                    key={dataset.name}
                    points={points}
                    fill="none"
                    stroke={dataset.color}
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
              {periodData.labels.map((label) => (
                <span key={label} className="text-xs">
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {chartType === "pie" && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Simple placeholder for pie chart */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {periodData.datasets.map((dataset, index) => {
                  const total = periodData.datasets.reduce(
                    (sum, ds) => sum + ds.data.reduce((a, b) => a + b, 0),
                    0,
                  );
                  const datasetTotal = dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = (datasetTotal / total) * 100;

                  // Very simplified pie chart segments
                  const startAngle =
                    index === 0
                      ? 0
                      : periodData.datasets
                          .slice(0, index)
                          .reduce(
                            (sum, ds) =>
                              sum +
                              (ds.data.reduce((a, b) => a + b, 0) / total) *
                                360,
                            0,
                          );
                  const endAngle = startAngle + (datasetTotal / total) * 360;

                  const startRad = ((startAngle - 90) * Math.PI) / 180;
                  const endRad = ((endAngle - 90) * Math.PI) / 180;

                  const x1 = 50 + 50 * Math.cos(startRad);
                  const y1 = 50 + 50 * Math.sin(startRad);
                  const x2 = 50 + 50 * Math.cos(endRad);
                  const y2 = 50 + 50 * Math.sin(endRad);

                  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

                  return (
                    <path
                      key={dataset.name}
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={dataset.color}
                    />
                  );
                })}
              </svg>
            </div>
            <div className="ml-4 flex flex-col">
              {periodData.datasets.map((dataset) => (
                <div key={dataset.name} className="flex items-center mb-1">
                  <div
                    className="w-3 h-3 mr-2"
                    style={{ backgroundColor: dataset.color }}
                  />
                  <span className="text-xs">{dataset.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback if no chart type selected */}
        {!chartType && (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Activity size={48} />
            <p className="mt-2">Select a chart type to view trends</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Usage Trends</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setChartType("bar")}
              className={`p-1 rounded ${chartType === "bar" ? "bg-white shadow-sm" : ""}`}
              aria-label="Bar chart"
            >
              <BarChart className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`p-1 rounded ${chartType === "line" ? "bg-white shadow-sm" : ""}`}
              aria-label="Line chart"
            >
              <LineChart className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={`p-1 rounded ${chartType === "pie" ? "bg-white shadow-sm" : ""}`}
              aria-label="Pie chart"
            >
              <PieChart className="h-4 w-4" />
            </button>
          </div>
          <Select defaultValue="daily">
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            {renderChart(trendsData.daily)}
          </TabsContent>
          <TabsContent value="weekly">
            {renderChart(trendsData.weekly)}
          </TabsContent>
          <TabsContent value="monthly">
            {renderChart(trendsData.monthly)}
          </TabsContent>
        </Tabs>
        <div className="mt-4">
          <div className="flex items-center justify-center space-x-6">
            {trendsData.daily.datasets.map((dataset) => (
              <div key={dataset.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: dataset.color }}
                />
                <span className="text-sm">{dataset.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageTrends;
