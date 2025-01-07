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
    // Normalize payment method to handle case and whitespace
    let method = (sale.paymentMethod || '').toLowerCase().trim();
    
    // Map payment methods to standardized names
    switch (method) {
      case 'efectivo':
      case 'cash':
        method = 'Cash';
        break;
      case 'tarjeta':
      case 'card':
        method = 'Card';
        break;
      case 'yappy':
        method = 'Yappy';
        break;
      default:
        method = 'Other';
    }
    
    acc[method] = (acc[method] || 0) + sale.total;
    return acc;
  }, {});

  // If no sales, return null
  if (Object.keys(paymentTotals).length === 0) return null;

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
          {Object.entries(paymentTotals).map(([method, amount]) => (
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