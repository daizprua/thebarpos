import { Sale, Expense } from "@/types/pos";

interface ShiftSummaryProps {
  initialCash: number;
  sales: Sale[];
  expenses: Expense[];
}

export function ShiftSummary({ initialCash, sales, expenses }: ShiftSummaryProps) {
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-sm font-medium">Initial Cash</p>
        <p className="text-2xl font-bold">${initialCash.toFixed(2)}</p>
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
  );
}