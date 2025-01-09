import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const DataSyncCard = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const syncData = async () => {
    setIsSyncing(true);
    try {
      // Sync products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*');
      
      if (productsError) throw productsError;

      // Sync product categories
      const { data: productCategories, error: categoriesError } = await supabase
        .from('product_categories')
        .select('*');
      
      if (categoriesError) throw categoriesError;

      // Sync expense categories
      const { data: expenseCategories, error: expenseCategoriesError } = await supabase
        .from('expense_categories')
        .select('*');
      
      if (expenseCategoriesError) throw expenseCategoriesError;

      // Sync sales
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('*');
      
      if (salesError) throw salesError;

      // Store the data in localStorage for offline access
      localStorage.setItem('syncedProducts', JSON.stringify(products));
      localStorage.setItem('syncedProductCategories', JSON.stringify(productCategories));
      localStorage.setItem('syncedExpenseCategories', JSON.stringify(expenseCategories));
      localStorage.setItem('syncedSales', JSON.stringify(sales));
      localStorage.setItem('lastSyncTime', new Date().toISOString());

      toast({
        title: "Sync Successful",
        description: "All data has been synchronized with the database.",
      });
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const lastSyncTime = localStorage.getItem('lastSyncTime');

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Data Synchronization</h2>
          {lastSyncTime && (
            <p className="text-sm text-gray-500">
              Last synced: {new Date(lastSyncTime).toLocaleString()}
            </p>
          )}
        </div>
        <Button 
          onClick={syncData} 
          disabled={isSyncing}
          className="min-w-[120px]"
        >
          {isSyncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            'Sync Now'
          )}
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          This will synchronize all data between the local storage and the database:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-500 ml-4">
          <li>Products and Categories</li>
          <li>Sales Records</li>
          <li>Expense Categories</li>
        </ul>
      </div>
    </Card>
  );
};