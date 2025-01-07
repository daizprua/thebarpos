import { Wine, Package, ShoppingCart } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { InventoryTable } from "@/components/InventoryTable";
import { QuickAddForm } from "@/components/QuickAddForm";
import { ArticleManager } from "@/components/ArticleManager";
import { ExcelImport } from "@/components/ExcelImport";
import { Button } from "@/components/ui/button";
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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  price: number;
  imageUrl?: string;
}

const initialInventory = [
  { id: 1, name: "Grey Goose Vodka", category: "Spirits", quantity: 5, threshold: 10, price: 29.99 },
  { id: 2, name: "Heineken", category: "Beer", quantity: 48, threshold: 24, price: 2.49 },
  { id: 3, name: "Dom Pérignon", category: "Wine", quantity: 3, threshold: 5, price: 199.99 },
  { id: 4, name: "Coca-Cola", category: "Mixers", quantity: 120, threshold: 50, price: 1.99 },
];

const Index = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory');
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    } else {
      setInventory(initialInventory);
      localStorage.setItem('inventory', JSON.stringify(initialInventory));
    }
  }, []);

  const handleDeleteItem = (id: number) => {
    const updatedInventory = inventory.filter(item => item.id !== id);
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    const updatedInventory = inventory.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  const handleAddItem = (newItem: Omit<InventoryItem, 'id' | 'threshold'>) => {
    const newId = Math.max(...inventory.map(item => item.id), 0) + 1;
    const itemWithDefaults: InventoryItem = {
      ...newItem,
      id: newId,
      threshold: 10,
    };
    const updatedInventory = [...inventory, itemWithDefaults];
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  const handleImportItems = (importedItems: typeof initialInventory) => {
    const updatedInventory = [...inventory, ...importedItems];
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  const handleDeleteAllItems = () => {
    setInventory([]);
    localStorage.setItem('inventory', JSON.stringify([]));
    toast({
      title: "Inventory Cleared",
      description: "All products have been deleted from the inventory.",
    });
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Bar Inventory Dashboard</h1>
            <p className="text-gray-400">Manage your inventory and track stock levels</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard title="Total Items" value={inventory.length.toString()} icon={<Package />} />
            <StatsCard 
              title="Low Stock Items" 
              value={inventory.filter(item => item.quantity <= (item.threshold || 10)).length.toString()} 
              icon={<ShoppingCart />} 
            />
          </div>

          <div className="flex justify-between items-center">
            <QuickAddForm />
            <div className="flex gap-4">
              <ExcelImport onImport={handleImportItems} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete All Products</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all products
                      from your inventory.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAllItems}>
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Article Management</h2>
            <ArticleManager onSaveArticle={handleAddItem} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Current Inventory</h2>
            <InventoryTable 
              items={inventory} 
              onDeleteItem={handleDeleteItem}
              onUpdateItem={handleUpdateItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;