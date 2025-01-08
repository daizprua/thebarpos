import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { ProductImage } from "./ProductImage";

interface ProductDisplayRowProps {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
  getStockStatus: (quantity: number, threshold: number) => JSX.Element;
}

export const ProductDisplayRow = ({ item, onEdit, onDelete, getStockStatus }: ProductDisplayRowProps) => {
  return (
    <>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <ProductImage
            imageUrl={item.imageUrl}
            onImageChange={() => {}}
            onImageRemove={() => {}}
          />
          <span className="font-medium text-white">{item.name}</span>
        </div>
      </td>
      <td className="p-4 text-gray-300">{item.category}</td>
      <td className="p-4 text-gray-300">{item.quantity}</td>
      <td className="p-4 text-gray-300">${item.price?.toFixed(2)}</td>
      <td className="p-4">{getStockStatus(item.quantity, item.threshold)}</td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
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
                <AlertDialogAction onClick={onDelete}>
                  Delete Item
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </>
  );
};