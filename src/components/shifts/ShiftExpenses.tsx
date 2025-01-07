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
import { Expense } from "@/types/pos";

interface ShiftExpensesProps {
  expenses: Expense[];
  onDeleteExpense?: (expenseId: number) => void;
  isAdmin?: boolean;
}

export function ShiftExpenses({ expenses, onDeleteExpense, isAdmin }: ShiftExpensesProps) {
  if (expenses.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Expenses</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            {isAdmin && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.description}</TableCell>
              <TableCell className="text-right text-red-500">
                ${expense.amount.toFixed(2)}
              </TableCell>
              {isAdmin && onDeleteExpense && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteExpense(expense.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}