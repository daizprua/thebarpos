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
  Tooltip,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export default function Statistics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [activeTab, setActiveTab] = useState("sales");

  const getSalesData = () => {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    
    const groupedData: { [key: string]: { sales: number; expenses: number } } = {};
    
    sales.forEach((sale: any) => {
      const date = new Date(sale.date);
      let key = '';
      
      switch (timeRange) {
        case 'daily':
          key = date.toLocaleDateString();
          break;
        case 'weekly':
          const weekNum = Math.ceil((date.getDate() + 6 - date.getDay()) / 7);
          key = `Week ${weekNum}`;
          break;
        case 'monthly':
          key = date.toLocaleString('default', { month: 'short' });
          break;
        case 'yearly':
          key = date.getFullYear().toString();
          break;
      }
      
      if (!groupedData[key]) {
        groupedData[key] = { sales: 0, expenses: 0 };
      }
      groupedData[key].sales += sale.total;
    });
    
    expenses.forEach((expense: any) => {
      const date = new Date(expense.date);
      let key = '';
      
      switch (timeRange) {
        case 'daily':
          key = date.toLocaleDateString();
          break;
        case 'weekly':
          const weekNum = Math.ceil((date.getDate() + 6 - date.getDay()) / 7);
          key = `Week ${weekNum}`;
          break;
        case 'monthly':
          key = date.toLocaleString('default', { month: 'short' });
          break;
        case 'yearly':
          key = date.getFullYear().toString();
          break;
      }
      
      if (!groupedData[key]) {
        groupedData[key] = { sales: 0, expenses: 0 };
      }
      groupedData[key].expenses += expense.amount;
    });
    
    return Object.entries(groupedData).map(([name, data]) => ({
      name,
      sales: data.sales,
      expenses: data.expenses,
      net: data.sales - data.expenses,
    }));
  };

  const getExpenseHistory = () => {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    return expenses.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Define chart configuration
  const chartConfig = {
    sales: {
      color: '#4ade80',
      label: 'Sales'
    },
    expenses: {
      color: '#ef4444',
      label: 'Expenses'
    },
    net: {
      color: '#60a5fa',
      label: 'Net'
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Statistics</h1>
          <p className="text-gray-400">Track your sales and expenses over time</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="sales">Sales & Expenses</TabsTrigger>
            <TabsTrigger value="expenses">Expense History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales">
            <div className="space-y-6">
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
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <BarChart data={getSalesData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Tooltip content={({ active, payload, label }) => (
                      <ChartTooltipContent
                        active={active}
                        payload={payload}
                        label={label}
                      />
                    )} />
                    <Legend />
                    <Bar dataKey="sales" name="Sales" fill="#4ade80" />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                    <Bar dataKey="net" name="Net" fill="#60a5fa" />
                  </BarChart>
                </ChartContainer>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="expenses">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Expense History</h3>
                <div className="space-y-4">
                  {getExpenseHistory().map((expense: any) => (
                    <div key={expense.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString()} {new Date(expense.date).toLocaleTimeString()}
                        </p>
                      </div>
                      <p className="text-red-500 font-semibold">-${expense.amount.toFixed(2)}</p>
                    </div>
                  ))}
                  {getExpenseHistory().length === 0 && (
                    <p className="text-center text-gray-500">No expenses recorded</p>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}