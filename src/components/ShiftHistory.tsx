import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { Shift, Sale, Expense } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export function ShiftHistory() {
  const [shifts, setShifts] = useState<Shift[]>(() => {
    try {
      const savedShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
      return Array.isArray(savedShifts) ? savedShifts : [];
    } catch {
      return [];
    }
  });

  const { toast } = useToast();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const getShiftSales = (shiftId: number): Sale[] => {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    return sales.filter((sale: Sale) => sale.shiftId === shiftId);
  };

  const getShiftExpenses = (shiftId: number): Expense[] => {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    return expenses.filter((expense: Expense) => expense.shiftId === shiftId);
  };

  const calculatePaymentBreakdown = (sales: Sale[]) => {
    return sales.reduce((acc: { [key: string]: number }, sale) => {
      const method = sale.paymentMethod || 'unknown';
      acc[method] = (acc[method] || 0) + sale.total;
      return acc;
    }, {});
  };

  const handleDeleteShift = (shiftId: number) => {
    if (user?.role !== 'admin') return;
    
    const updatedShifts = shifts.filter(shift => shift.id !== shiftId);
    localStorage.setItem('shifts', JSON.stringify(updatedShifts));
    setShifts(updatedShifts);
    
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    const updatedSales = existingSales.filter((sale: any) => sale.shiftId !== shiftId);
    localStorage.setItem('sales', JSON.stringify(updatedSales));
    
    toast({
      title: "Shift Deleted",
      description: "The shift and its associated sales have been deleted.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <span>Shift History</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shift History</DialogTitle>
          <DialogDescription>
            Detailed history of all shifts including sales and expenses
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {shifts.map((shift) => {
            const shiftSales = getShiftSales(shift.id);
            const shiftExpenses = getShiftExpenses(shift.id);
            const paymentBreakdown = calculatePaymentBreakdown(shiftSales);
            const totalSales = shiftSales.reduce((sum, sale) => sum + sale.total, 0);
            const totalExpenses = shiftExpenses.reduce((sum, expense) => sum + expense.amount, 0);

            return (
              <Card key={shift.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Shift {new Date(shift.startTime).toLocaleDateString()}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Started: {new Date(shift.startTime).toLocaleTimeString()}
                      {shift.endTime && ` - Ended: ${new Date(shift.endTime).toLocaleTimeString()}`}
                    </p>
                  </div>
                  {user?.role === 'admin' && shift.endTime && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteShift(shift.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">Initial Cash</p>
                    <p className="text-2xl font-bold">${shift.initialCash.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Sales</p>
                    <p className="text-2xl font-bold text-green-500">${totalSales.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Payment Breakdown</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(paymentBreakdown).map(([method, amount]) => (
                        <TableRow key={method}>
                          <TableCell className="capitalize">{method}</TableCell>
                          <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {shiftExpenses.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Expenses</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shiftExpenses.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell className="text-right text-red-500">
                              ${expense.amount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            );
          })}
          {shifts.length === 0 && (
            <p className="text-center text-muted-foreground">No shift history available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}