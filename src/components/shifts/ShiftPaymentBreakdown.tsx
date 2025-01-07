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

const paymentMethodNames: { [key: string]: string } = {
  efectivo: "Cash",
  tarjeta: "Card",
  yappy: "Yappy"
};

export function ShiftPaymentBreakdown({ sales }: ShiftPaymentBreakdownProps) {
  const salesByPaymentMethod = sales.reduce((acc: { [key: string]: number }, sale) => {
    const method = sale.paymentMethod || 'unknown';
    acc[method] = (acc[method] || 0) + sale.total;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Sales by Payment Method</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(salesByPaymentMethod).map(([method, amount]) => (
            <TableRow key={method}>
              <TableCell>{paymentMethodNames[method] || method}</TableCell>
              <TableCell className="text-right">
                ${amount.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}