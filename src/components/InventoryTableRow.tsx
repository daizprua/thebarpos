import { TableRow } from "@/components/ui/table";
import { ProductEditForm } from "./inventory/ProductEditForm";
import { ProductDisplayRow } from "./inventory/ProductDisplayRow";

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
  return (
    <TableRow>
      {editingId === item.id ? (
        <ProductEditForm
          editForm={editForm}
          onInputChange={onInputChange}
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        <ProductDisplayRow
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
          getStockStatus={getStockStatus}
        />
      )}
    </TableRow>
  );
};