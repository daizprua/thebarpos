import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SavedSale } from "@/types/pos";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavedSalesTabProps {
  savedSales: SavedSale[];
  onLoadSale: (sale: SavedSale) => void;
  onNewSale: () => void;
}

export function SavedSalesTab({ savedSales, onLoadSale, onNewSale }: SavedSalesTabProps) {
  const { toast } = useToast();

  const handleLoadSale = (sale: SavedSale) => {
    onLoadSale(sale);
    toast({
      title: "Sale Loaded",
      description: `Loaded sale for ${sale.clientName}`,
    });
  };

  return (
    <div className="mt-8">
      <Tabs defaultValue="products">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="saved">Saved Sales ({savedSales.length})</TabsTrigger>
          </TabsList>
          <Button onClick={onNewSale} variant="outline" className="ml-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>

        <TabsContent value="products">
          {/* Products section will be rendered here by parent */}
        </TabsContent>

        <TabsContent value="saved">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {savedSales.map((sale) => (
              <div
                key={sale.id}
                className="bg-card/50 backdrop-blur-lg border-0 p-4 rounded-lg"
              >
                <h3 className="font-semibold text-white mb-2">{sale.clientName}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Items: {sale.items.length} | Total: ${sale.total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {new Date(sale.date).toLocaleDateString()}
                </p>
                <Button
                  onClick={() => handleLoadSale(sale)}
                  className="w-full"
                  variant="secondary"
                >
                  Load Sale
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}