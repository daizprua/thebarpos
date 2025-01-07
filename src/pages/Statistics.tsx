import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

// Mock data - replace with real data when connected to backend
const dailyData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 2000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 1890 },
  { name: "Sat", sales: 2390 },
  { name: "Sun", sales: 3490 },
];

const weeklyData = [
  { name: "Week 1", sales: 24000 },
  { name: "Week 2", sales: 21000 },
  { name: "Week 3", sales: 18000 },
  { name: "Week 4", sales: 23490 },
];

const monthlyData = [
  { name: "Jan", sales: 94000 },
  { name: "Feb", sales: 83000 },
  { name: "Mar", sales: 72000 },
  { name: "Apr", sales: 86780 },
  { name: "May", sales: 91890 },
  { name: "Jun", sales: 82390 },
];

const yearlyData = [
  { name: "2021", sales: 940000 },
  { name: "2022", sales: 1083000 },
  { name: "2023", sales: 1272000 },
  { name: "2024", sales: 986780 },
];

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export default function Statistics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  const getDataForRange = () => {
    switch (timeRange) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sales Statistics</h1>
          <p className="text-gray-400">Track your sales performance over time</p>
        </div>

        <div className="flex gap-4">
          <Button
            variant={timeRange === "daily" ? "default" : "outline"}
            onClick={() => setTimeRange("daily")}
          >
            Daily
          </Button>
          <Button
            variant={timeRange === "weekly" ? "default" : "outline"}
            onClick={() => setTimeRange("weekly")}
          >
            Weekly
          </Button>
          <Button
            variant={timeRange === "monthly" ? "default" : "outline"}
            onClick={() => setTimeRange("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={timeRange === "yearly" ? "default" : "outline"}
            onClick={() => setTimeRange("yearly")}
          >
            Yearly
          </Button>
        </div>

        <Card className="p-6 backdrop-blur-lg bg-card border-none">
          <ChartContainer
            className="h-[400px]"
            config={{
              sales: {
                color: "#9b87f5",
              },
            }}
          >
            <BarChart data={getDataForRange()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <ChartTooltip>
                <ChartTooltipContent />
              </ChartTooltip>
              <Bar dataKey="sales" fill="var(--color-sales)" />
            </BarChart>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
}