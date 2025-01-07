import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { InventoryTableRow } from "./InventoryTableRow";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  price: number;
  imageUrl?: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;

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

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-lg border bg-card backdrop-blur-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Category</TableHead>
              <TableHead className="text-gray-400">Stock</TableHead>
              <TableHead className="text-gray-400">Price</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item) => (
              <InventoryTableRow
                key={item.id}
                item={item}
                editingId={editingId}
                editForm={editForm}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSave={handleSave}
                onCancel={handleCancel}
                onInputChange={handleInputChange}
                getStockStatus={getStockStatus}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};