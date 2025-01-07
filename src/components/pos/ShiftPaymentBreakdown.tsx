import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sale } from "@/types/pos";

const formatPaymentMethod = (method: string): string => {
  const methodMap: { [key: string]: string } = {
    'efectivo': 'Cash',
    'tarjeta': 'Card',
    'yappy': 'Yappy',
    'unknown': 'Unknown'
  };
  return methodMap[method?.toLowerCase()] || method || 'Unknown';
};

export const calculatePaymentBreakdown = (sales: Sale[]) => {
  return sales.reduce((acc: { [key: string]: number }, sale) => {
    const method = sale.paymentMethod?.toLowerCase() || 'unknown';
    const formattedMethod = formatPaymentMethod(method);
    acc[formattedMethod] = (acc[formattedMethod] || 0) + sale.total;
    return acc;
  }, {});
};

interface ShiftPaymentBreakdownProps {
  sales: Sale[];
}

export function ShiftPaymentBreakdown({ sales }: ShiftPaymentBreakdownProps) {
  const paymentBreakdown = calculatePaymentBreakdown(sales);

  return (
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
              <TableCell>{method}</TableCell>
              <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}