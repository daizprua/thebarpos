import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
}

interface InventoryTableProps {
  items: InventoryItem[];
  onDeleteItem?: (id: number) => void;
}

export const InventoryTable = ({ items, onDeleteItem }: InventoryTableProps) => {
  const { toast } = useToast();

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity <= threshold) return <Badge variant="destructive">Low Stock</Badge>;
    if (quantity <= threshold * 2) return <Badge className="bg-warning">Medium</Badge>;
    return <Badge className="bg-primary">Good</Badge>;
  };

  const handleDelete = (id: number) => {
    if (onDeleteItem) {
      onDeleteItem(id);
      toast({
        title: "Item Deleted",
        description: "The inventory item has been removed successfully.",
      });
    }
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
            <TableHead className="text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-white">{item.name}</TableCell>
              <TableCell className="text-gray-300">{item.category}</TableCell>
              <TableCell className="text-gray-300">{item.quantity}</TableCell>
              <TableCell>{getStockStatus(item.quantity, item.threshold)}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};