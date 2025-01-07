import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUp, ArrowDown } from "lucide-react";

const defaultOrder = [
  { id: 'home', label: 'Home' },
  { id: 'pos', label: 'POS' },
  { id: 'sales', label: 'Sales' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'shifts', label: 'Shifts' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'control-panel', label: 'Control Panel' }
];

export const MenuOrderCard = () => {
  const [menuItems, setMenuItems] = useState(() => {
    const savedOrder = localStorage.getItem('menuOrder');
    if (savedOrder) {
      const orderIds = JSON.parse(savedOrder);
      return defaultOrder.sort((a, b) => 
        orderIds.indexOf(a.id) - orderIds.indexOf(b.id)
      );
    }
    return defaultOrder;
  });

  const { toast } = useToast();

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= menuItems.length) return;

    const newItems = [...menuItems];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setMenuItems(newItems);
    
    // Save to localStorage
    const newOrder = newItems.map(item => item.id);
    localStorage.setItem('menuOrder', JSON.stringify(newOrder));
    
    toast({
      title: "Menu order updated",
      description: "The new menu order has been saved.",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Menu Order</h2>
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
            <span>{item.label}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveItem(index, 'up')}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveItem(index, 'down')}
                disabled={index === menuItems.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};