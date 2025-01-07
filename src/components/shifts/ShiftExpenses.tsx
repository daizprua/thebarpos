import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Expense } from "@/types/pos";

interface ShiftExpensesProps {
  expenses: Expense[];
}

export function ShiftExpenses({ expenses }: ShiftExpensesProps) {
  if (expenses.length === 0) return null;

  return (
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
          {expenses.map((expense) => (
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
  );
}