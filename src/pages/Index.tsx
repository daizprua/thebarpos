import { Wine, DollarSign, Package, ShoppingCart } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { InventoryTable } from "@/components/InventoryTable";
import { QuickAddForm } from "@/components/QuickAddForm";
import { ArticleManager } from "@/components/ArticleManager";
import { ExcelImport } from "@/components/ExcelImport";
import { useState } from "react";

const initialInventory = [
  { id: 1, name: "Grey Goose Vodka", category: "Spirits", quantity: 5, threshold: 10, price: 29.99 },
  { id: 2, name: "Heineken", category: "Beer", quantity: 48, threshold: 24, price: 2.49 },
  { id: 3, name: "Dom Pérignon", category: "Wine", quantity: 3, threshold: 5, price: 199.99 },
  { id: 4, name: "Coca-Cola", category: "Mixers", quantity: 120, threshold: 50, price: 1.99 },
];

const Index = () => {
  const [inventory, setInventory] = useState(initialInventory);

  const handleDeleteItem = (id: number) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const handleUpdateItem = (updatedItem: typeof initialInventory[0]) => {
    setInventory(inventory.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const handleImportItems = (importedItems: typeof initialInventory) => {
    setInventory([...inventory, ...importedItems]);
  };

  const calculateTotalValue = () => {
    return inventory.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bar Inventory Dashboard</h1>
          <p className="text-gray-400">Manage your inventory and track stock levels</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Items" value={inventory.length.toString()} icon={<Package />} />
          <StatsCard 
            title="Low Stock Items" 
            value={inventory.filter(item => item.quantity <= item.threshold).length.toString()} 
            icon={<ShoppingCart />} 
          />
          <StatsCard title="Value in Stock" value={`$${calculateTotalValue().toFixed(2)}`} icon={<DollarSign />} />
          <StatsCard title="Items Sold Today" value="47" icon={<Wine />} />
        </div>

        <div className="flex justify-between items-center">
          <QuickAddForm />
          <ExcelImport onImport={handleImportItems} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Current Inventory</h2>
          <InventoryTable 
            items={inventory} 
            onDeleteItem={handleDeleteItem}
            onUpdateItem={handleUpdateItem}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Article Management</h2>
          <ArticleManager />
        </div>
      </div>
    </div>
  );
};

export default Index;