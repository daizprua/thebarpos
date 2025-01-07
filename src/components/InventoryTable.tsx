import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  price: number;
}

interface InventoryTableProps {
  items: InventoryItem[];
  onDeleteItem?: (id: number) => void;
  onUpdateItem?: (item: InventoryItem) => void;
}

export const InventoryTable = ({ items, onDeleteItem, onUpdateItem }: InventoryTableProps) => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<InventoryItem | null>(null);

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

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = () => {
    if (editForm && onUpdateItem) {
      onUpdateItem(editForm);
      setEditingId(null);
      setEditForm(null);
      toast({
        title: "Item Updated",
        description: "The inventory item has been updated successfully.",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleInputChange = (field: keyof InventoryItem, value: string) => {
    if (!editForm) return;

    let parsedValue: string | number = value;
    if (field === 'quantity' || field === 'threshold' || field === 'price') {
      parsedValue = parseFloat(value) || 0;
    }

    setEditForm({
      ...editForm,
      [field]: parsedValue,
    });
  };

  return (
    <div className="rounded-lg border bg-card backdrop-blur-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">Name</TableHead>
            <TableHead className="text-gray-400">Category</TableHead>
            <TableHead className="text-gray-400">Quantity</TableHead>
            <TableHead className="text-gray-400">Price</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              {editingId === item.id ? (
                <>
                  <TableCell>
                    <Input
                      value={editForm?.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="max-w-[200px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editForm?.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="max-w-[150px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editForm?.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      className="max-w-[100px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editForm?.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="max-w-[100px]"
                    />
                  </TableCell>
                  <TableCell>{getStockStatus(item.quantity, item.threshold)}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="default" size="sm" onClick={handleSave}>
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="font-medium text-white">{item.name}</TableCell>
                  <TableCell className="text-gray-300">{item.category}</TableCell>
                  <TableCell className="text-gray-300">{item.quantity}</TableCell>
                  <TableCell className="text-gray-300">${item.price?.toFixed(2)}</TableCell>
                  <TableCell>{getStockStatus(item.quantity, item.threshold)}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};