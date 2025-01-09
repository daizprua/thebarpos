import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TimeRangeFilter } from "@/components/common/TimeRangeFilter";
import { CustomExpenseForm } from "@/components/expenses/CustomExpenseForm";
import { FixedExpensesModule } from "@/components/expenses/FixedExpensesModule";

type TimeRange = "day" | "week" | "month";

const ExpenseHistory = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [expenses, setExpenses] = useState(() => {
    const expensesStr = localStorage.getItem('expenses');
    return expensesStr ? JSON.parse(expensesStr) : [];
  });

  const { toast } = useToast();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';

  const filterExpenses = (expenses: any[], range: TimeRange) => {
    const now = new Date();
    const msInDay = 24 * 60 * 60 * 1000;
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const diffDays = Math.floor((now.getTime() - expenseDate.getTime()) / msInDay);
      
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

  const handleDeleteExpense = (expenseId: number) => {
    try {
      const updatedExpenses = expenses.filter((expense: any) => expense.id !== expenseId);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses);
      
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    }
  };

  const filteredExpenses = filterExpenses(expenses, timeRange);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <FixedExpensesModule />
      
      <Card className="p-6 bg-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Expense History</h2>
          <div className="flex gap-4">
            <TimeRangeFilter
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
            <CustomExpenseForm />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50">
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-white">Amount</TableHead>
              <TableHead className="text-white">Category</TableHead>
              {isAdmin && <TableHead className="text-white w-[100px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense: any, index: number) => (
              <TableRow key={index} className="border-border hover:bg-muted/50">
                <TableCell className="text-white">
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-white">{expense.description}</TableCell>
                <TableCell className="text-white">${expense.amount.toFixed(2)}</TableCell>
                <TableCell className="text-white">{expense.category || 'N/A'}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {filteredExpenses.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={isAdmin ? 5 : 4} 
                  className="text-center text-white"
                >
                  No expenses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ExpenseHistory;