import { ShiftSummary as ShiftSummaryType } from "@/types/pos";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ShiftSummaryProps {
  summary: ShiftSummaryType;
}

export function ShiftSummary({ summary }: ShiftSummaryProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-lg font-semibold">${summary.totalSales.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-lg font-semibold text-red-500">
              -${summary.totalExpenses.toFixed(2)}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Net Total</p>
            <p className="text-xl font-bold">${summary.netTotal.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Breakdown</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(summary.paymentBreakdown).map(([method, amount]) => (
              <TableRow key={method}>
                <TableCell className="capitalize">{method}</TableCell>
                <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Expenses</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell className="text-right text-red-500">
                  -${expense.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}