import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sale } from "@/types/pos";

// Mock data - replace with real data when connected to backend
const mockSales: Sale[] = [
  {
    id: 1,
    items: [
      { id: 1, name: "Grey Goose Vodka", category: "Spirits", price: 29.99, quantity: 2 },
      { id: 4, name: "Coca-Cola", category: "Mixers", price: 2.99, quantity: 3 },
    ],
    total: 68.95,
    date: "2024-04-10T15:30:00",
  },
  {
    id: 2,
    items: [
      { id: 2, name: "Heineken", category: "Beer", price: 4.99, quantity: 6 },
    ],
    total: 29.94,
    date: "2024-04-09T18:45:00",
  },
];

type TimeRange = "day" | "week" | "month";

export function SalesHistory() {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");

  const filterSales = (sales: Sale[], range: TimeRange) => {
    const now = new Date();
    const msInDay = 24 * 60 * 60 * 1000;
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const diffDays = Math.floor((now.getTime() - saleDate.getTime()) / msInDay);
      
      switch (range) {
        case "day":
          return diffDays < 1;
        case "week":
          return diffDays < 7;
        case "month":
          return diffDays < 30;
        default:
          return true;
      }
    });
  };

  const filteredSales = filterSales(mockSales, timeRange);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Sales History</h2>
        <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card/50 backdrop-blur-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{format(new Date(sale.date), "PPp")}</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {sale.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.name} (${item.price.toFixed(2)} each)
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="text-right">${sale.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}