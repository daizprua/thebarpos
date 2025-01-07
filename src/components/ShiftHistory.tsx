import { useState } from "react";
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
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ShiftPaymentBreakdown } from "./pos/ShiftPaymentBreakdown";

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
    try {
      const sales = JSON.parse(localStorage.getItem('sales') || '[]');
      return sales.filter((sale: Sale) => sale.shiftId === shiftId);
    } catch (error) {
      console.error('Error loading sales:', error);
      return [];
    }
  };

  const getShiftExpenses = (shiftId: number): Expense[] => {
    try {
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      return expenses.filter((expense: Expense) => expense.shiftId === shiftId);
    } catch (error) {
      console.error('Error loading expenses:', error);
      return [];
    }
  };

  const handleDeleteShift = (shiftId: number) => {
    if (user?.role !== 'admin') return;
    
    try {
      const updatedShifts = shifts.filter(shift => shift.id !== shiftId);
      localStorage.setItem('shifts', JSON.stringify(updatedShifts));
      setShifts(updatedShifts);
      
      const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
      const updatedSales = existingSales.filter((sale: any) => sale.shiftId !== shiftId);
      localStorage.setItem('sales', JSON.stringify(updatedSales));

      const existingExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const updatedExpenses = existingExpenses.filter((expense: Expense) => expense.shiftId !== shiftId);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      
      toast({
        title: "Shift Deleted",
        description: "The shift and its associated records have been deleted.",
      });
    } catch (error) {
      console.error('Error deleting shift:', error);
      toast({
        title: "Error",
        description: "Failed to delete shift. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Shift History</h1>
      <div className="space-y-4">
        {shifts.map((shift) => {
          const shiftSales = getShiftSales(shift.id);
          const shiftExpenses = getShiftExpenses(shift.id);
          const totalSales = shiftSales.reduce((sum, sale) => sum + sale.total, 0);
          const totalExpenses = shiftExpenses.reduce((sum, expense) => sum + expense.amount, 0);

          return (
            <Collapsible key={shift.id}>
              <Card className="p-4">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <ChevronDown className="h-4 w-4" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">
                        {new Date(shift.startTime).toLocaleDateString()}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Started by: {shift.startedBy}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-500">
                      ${totalSales.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {shiftSales.length} sales
                    </p>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="pt-4">
                  <div className="space-y-4">
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

                    <ShiftPaymentBreakdown sales={shiftSales} />

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
                    
                    {user?.role === 'admin' && shift.endTime && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteShift(shift.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete Shift
                        </button>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
        {shifts.length === 0 && (
          <p className="text-center text-muted-foreground">No shift history available</p>
        )}
      </div>
    </div>
  );
}