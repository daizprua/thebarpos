import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
}

interface InventoryTableProps {
  items: InventoryItem[];
}

export const InventoryTable = ({ items }: InventoryTableProps) => {
  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity <= threshold) return <Badge variant="destructive">Low Stock</Badge>;
    if (quantity <= threshold * 2) return <Badge className="bg-warning">Medium</Badge>;
    return <Badge className="bg-primary">Good</Badge>;
  };

  return (
    <div className="rounded-lg border bg-card backdrop-blur-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">Name</TableHead>
            <TableHead className="text-gray-400">Category</TableHead>
            <TableHead className="text-gray-400">Quantity</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-white">{item.name}</TableCell>
              <TableCell className="text-gray-300">{item.category}</TableCell>
              <TableCell className="text-gray-300">{item.quantity}</TableCell>
              <TableCell>{getStockStatus(item.quantity, item.threshold)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};