import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Sale } from "@/types/pos";
import { isAdmin } from "@/lib/auth";

type TimeRange = "day" | "week" | "month";

const formatPaymentMethod = (method: string | undefined): string => {
  if (!method) return 'Unknown';
  
  switch (method.toLowerCase().trim()) {
    case 'efectivo':
    case 'cash':
      return 'Cash';
    case 'tarjeta':
    case 'card':
      return 'Card';
    case 'yappy':
      return 'Yappy';
    default:
      return method;
  }
};

export function SalesHistory() {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [sales, setSales] = useState<Sale[]>([]);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userIsAdmin = isAdmin(user);

  useEffect(() => {
    const savedSales = JSON.parse(localStorage.getItem('sales') || '[]');
    setSales(savedSales);
  }, []);

  const handleDeleteSale = (saleId: number) => {
    const updatedSales = sales.filter(sale => sale.id !== saleId);
    setSales(updatedSales);
    localStorage.setItem('sales', JSON.stringify(updatedSales));
    toast.success('Sale deleted successfully');
  };

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

  const filteredSales = filterSales(sales, timeRange);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Sales History</h2>
        <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px] bg-card text-white">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="day" className="text-white hover:bg-muted/50">Today</SelectItem>
            <SelectItem value="week" className="text-white hover:bg-muted/50">This Week</SelectItem>
            <SelectItem value="month" className="text-white hover:bg-muted/50">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card backdrop-blur-none">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50">
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Items</TableHead>
              <TableHead className="text-white">Payment Method</TableHead>
              <TableHead className="text-right text-white">Total</TableHead>
              {userIsAdmin && <TableHead className="w-[100px] text-white">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={userIsAdmin ? 5 : 4} className="text-center text-white">No sales found</TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale) => (
                <TableRow key={sale.id} className="border-border hover:bg-muted/50">
                  <TableCell className="text-white">{format(new Date(sale.date), "PPp")}</TableCell>
                  <TableCell className="text-white">
                    <ul className="list-disc list-inside">
                      {sale.items.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.name} (${item.price.toFixed(2)} each)
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-white">{formatPaymentMethod(sale.paymentMethod)}</TableCell>
                  <TableCell className="text-right text-white">${sale.total.toFixed(2)}</TableCell>
                  {userIsAdmin && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSale(sale.id)}
                        className="hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}