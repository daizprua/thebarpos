import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  price: number;
  imageUrl?: string;
}

interface InventoryTableRowProps {
  item: InventoryItem;
  editingId: number | null;
  editForm: InventoryItem | null;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number) => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: keyof InventoryItem, value: string) => void;
  getStockStatus: (quantity: number, threshold: number) => JSX.Element;
}

export const InventoryTableRow = ({
  item,
  editingId,
  editForm,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onInputChange,
  getStockStatus,
}: InventoryTableRowProps) => {
  if (editingId === item.id) {
    return (
      <TableRow>
        <TableCell>
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-10 h-10 rounded object-cover mb-2"
            />
          )}
          <Input
            value={editForm?.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            className="max-w-[200px]"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editForm?.category}
            onChange={(e) => onInputChange('category', e.target.value)}
            className="max-w-[150px]"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={editForm?.quantity}
            onChange={(e) => onInputChange('quantity', e.target.value)}
            className="max-w-[100px]"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={editForm?.price}
            onChange={(e) => onInputChange('price', e.target.value)}
            className="max-w-[100px]"
          />
        </TableCell>
        <TableCell>{getStockStatus(item.quantity, item.threshold)}</TableCell>
        <TableCell className="space-x-2">
          <Button variant="default" size="sm" onClick={onSave}>
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-white">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-10 h-10 rounded object-cover mb-2"
          />
        )}
        {item.name}
      </TableCell>
      <TableCell className="text-gray-300">{item.category}</TableCell>
      <TableCell className="text-gray-300">{item.quantity}</TableCell>
      <TableCell className="text-gray-300">${item.price?.toFixed(2)}</TableCell>
      <TableCell>{getStockStatus(item.quantity, item.threshold)}</TableCell>
      <TableCell className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(item)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};