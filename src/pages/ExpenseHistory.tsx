import { useState } from "react";
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

const ExpenseHistory = () => {
  const [expenses, setExpenses] = useState(() => {
    const expensesStr = localStorage.getItem('expenses');
    return expensesStr ? JSON.parse(expensesStr) : [];
  });

  const { toast } = useToast();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';

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

  return (
    <div className="container mx-auto py-6 space-y-4">
      <Card className="p-6 bg-card">
        <h2 className="text-2xl font-bold mb-4 text-white">Expense History</h2>
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
            {expenses.map((expense: any, index: number) => (
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
            {expenses.length === 0 && (
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