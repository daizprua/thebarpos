import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Statistics = () => {
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    // Load sales data
    const sales = JSON.parse(localStorage.getItem("sales") || "[]");
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

    // Process sales data
    const processedSales = processSalesData(sales);
    setSalesData(processedSales);

    // Process expenses data
    const processedExpenses = processExpensesData(expenses);
    setExpensesData(processedExpenses);
  }, []);

  const processSalesData = (sales) => {
    const dailySales = sales.reduce((acc, sale) => {
      const date = new Date(sale.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + sale.total;
      return acc;
    }, {});

    return Object.entries(dailySales).map(([date, total]) => ({
      date,
      total,
    }));
  };

  const processExpensesData = (expenses) => {
    const dailyExpenses = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(dailyExpenses).map(([date, total]) => ({
      date,
      total,
    }));
  };

  const calculateTotalSales = () => {
    return salesData.reduce((total, day) => total + day.total, 0);
  };

  const calculateTotalExpenses = () => {
    return expensesData.reduce((total, day) => total + day.total, 0);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
          <p className="text-2xl font-bold">${calculateTotalSales().toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-500">
            ${calculateTotalExpenses().toFixed(2)}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Net Income</h3>
          <p className="text-2xl font-bold">
            ${(calculateTotalSales() - calculateTotalExpenses()).toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Sales Over Time</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  name="Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Expenses Over Time</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={expensesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#ff0000"
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;