import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onInputChange('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmDelete = () => {
    onDelete(item.id);
    setShowDeleteDialog(false);
  };

  const handleConfirmEdit = () => {
    onEdit(item);
    setShowEditDialog(false);
  };

  if (editingId === item.id) {
    return (
      <TableRow>
        <TableCell>
          <div className="space-y-2">
            {editForm?.imageUrl && (
              <img
                src={editForm.imageUrl}
                alt={editForm.name}
                className="w-16 h-16 rounded object-cover"
              />
            )}
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="max-w-[200px]"
              />
            </div>
            <Input
              value={editForm?.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className="max-w-[200px]"
            />
          </div>
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" size="sm">
                Save
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Save Changes</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to save these changes? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onSave}>Save Changes</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
        <div className="flex items-center gap-2">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <span>{item.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-gray-300">{item.category}</TableCell>
      <TableCell className="text-gray-300">{item.quantity}</TableCell>
      <TableCell className="text-gray-300">${item.price?.toFixed(2)}</TableCell>
      <TableCell>{getStockStatus(item.quantity, item.threshold)}</TableCell>
      <TableCell className="space-x-2">
        <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Item</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to edit this item? You can review and save your changes after.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmEdit}>
                Edit Item
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Item</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this item? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                Delete Item
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};