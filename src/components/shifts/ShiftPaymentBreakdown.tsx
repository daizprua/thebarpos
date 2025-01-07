import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sale } from "@/types/pos";

interface ShiftPaymentBreakdownProps {
  sales: Sale[];
}

export function ShiftPaymentBreakdown({ sales }: ShiftPaymentBreakdownProps) {
  // Group sales by payment method and calculate totals
  const paymentTotals = sales.reduce((acc: { [key: string]: number }, sale) => {
    const method = sale.paymentMethod || 'Unknown';
    
    // Map payment methods to standardized names
    let displayMethod;
    switch (method.toLowerCase().trim()) {
      case 'efectivo':
      case 'cash':
        displayMethod = 'Cash';
        break;
      case 'tarjeta':
      case 'card':
        displayMethod = 'Card';
        break;
      case 'yappy':
        displayMethod = 'Yappy';
        break;
      default:
        displayMethod = method || 'Unknown';
    }
    
    acc[displayMethod] = (acc[displayMethod] || 0) + sale.total;
    return acc;
  }, {});

  // Calculate total amount
  const totalAmount = Object.values(paymentTotals).reduce((sum, amount) => sum + amount, 0);

  // If no sales, return null
  if (Object.keys(paymentTotals).length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Payment Breakdown</h4>
      <div className="grid gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(paymentTotals).map(([method, amount]) => (
              <TableRow key={method}>
                <TableCell className="font-medium">{method}</TableCell>
                <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {((amount / totalAmount) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2">
              <TableCell className="font-bold">Total</TableCell>
              <TableCell className="text-right font-bold">${totalAmount.toFixed(2)}</TableCell>
              <TableCell className="text-right font-bold">100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}