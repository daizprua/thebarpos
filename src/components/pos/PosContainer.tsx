import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProductsSection } from "./ProductsSection";
import { CartSection } from "./CartSection";
import { ShiftControls } from "./ShiftControls";
import { SavedSalesTab } from "./SavedSalesTab";
import { Product, CartItem, SavedSale, Shift } from "@/types/pos";

export function PosContainer() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [savedSales, setSavedSales] = useState<SavedSale[]>([]);
  const [currentSavedSaleId, setCurrentSavedSaleId] = useState<number | null>(null);
  const [activeShift, setActiveShift] = useState<{
    startTime: string;
    id: number;
  } | null>(() => {
    const saved = localStorage.getItem('activeShift');
    return saved ? JSON.parse(saved) : null;
  });
  
  const { toast } = useToast();

  // Get user from localStorage to check if admin
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const inventoryItems = JSON.parse(localStorage.getItem('inventory') || '[]');
    const mappedProducts: Product[] = inventoryItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      imageUrl: item.imageUrl
    }));
    setProducts(mappedProducts);

    // Load saved sales
    const savedSalesData = JSON.parse(localStorage.getItem('savedSales') || '[]');
    setSavedSales(savedSalesData);
  }, []);

  const addToCart = (product: Product) => {
    if (!activeShift) {
      toast({
        variant: "destructive",
        title: "No Active Shift",
        description: "Please start your shift before making sales.",
      });
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    toast({
      description: `Added ${product.name} to cart`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
    toast({
      description: "Item removed from cart",
      variant: "destructive",
    });
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleDeleteSale = (saleId: number) => {
    const updatedSales = savedSales.filter(sale => sale.id !== saleId);
    localStorage.setItem('savedSales', JSON.stringify(updatedSales));
    setSavedSales(updatedSales);
    setCurrentSavedSaleId(null);
    setCart([]);
  };

  const handleSaveSale = (clientName: string) => {
    if (!activeShift) return;
    
    const currentTime = new Date().toISOString();
    
    if (currentSavedSaleId) {
      // Update existing saved sale
      const updatedSales = savedSales.map(sale => 
        sale.id === currentSavedSaleId 
          ? {
              ...sale,
              clientName,
              items: cart,
              total: getTotalAmount(),
              date: currentTime
            }
          : sale
      );
      
      localStorage.setItem('savedSales', JSON.stringify(updatedSales));
      setSavedSales(updatedSales);
      
      toast({
        title: "Sale Updated",
        description: `Sale updated for ${clientName}`,
      });
    } else {
      // Create new saved sale
      const savedSale: SavedSale = {
        id: Date.now(),
        clientName,
        items: cart,
        total: getTotalAmount(),
        date: currentTime,
        shiftId: activeShift.id,
      };

      const updatedSales = [...savedSales, savedSale];
      localStorage.setItem('savedSales', JSON.stringify(updatedSales));
      setSavedSales(updatedSales);
      setCurrentSavedSaleId(savedSale.id);

      toast({
        title: "Sale Saved",
        description: `Sale saved for ${clientName}`,
      });
    }
  };

  const handleLoadSale = (sale: SavedSale) => {
    setCart(sale.items);
    setCurrentSavedSaleId(sale.id);
    toast({
      description: `Loaded sale for ${sale.clientName}`,
    });
  };

  const handleNewSale = () => {
    if (cart.length > 0) {
      if (window.confirm('Starting a new sale will clear the current cart. Continue?')) {
        setCart([]);
        setCurrentSavedSaleId(null);
      }
    } else {
      setCart([]);
      setCurrentSavedSaleId(null);
    }
  };

  const handleCheckout = () => {
    if (!activeShift) {
      toast({
        variant: "destructive",
        title: "No Active Shift",
        description: "Please start your shift before making sales.",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        description: "Cart is empty",
        variant: "destructive",
      });
      return;
    }

    const newSale = {
      id: Date.now(),
      items: cart,
      total: getTotalAmount(),
      date: new Date().toISOString(),
      shiftId: activeShift.id
    };

    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    localStorage.setItem('sales', JSON.stringify([...existingSales, newSale]));

    // If this was a saved sale, remove it from saved sales
    if (currentSavedSaleId) {
      const updatedSavedSales = savedSales.filter(sale => sale.id !== currentSavedSaleId);
      localStorage.setItem('savedSales', JSON.stringify(updatedSavedSales));
      setSavedSales(updatedSavedSales);
      setCurrentSavedSaleId(null);
    }

    toast({
      title: "Order Completed",
      description: `Total Amount: $${getTotalAmount().toFixed(2)}`,
    });
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <ShiftControls
            activeShift={activeShift}
            onStartShift={(initialCash) => {
              const newShift = {
                id: Date.now(),
                startTime: new Date().toISOString(),
                initialCash,
                totalSales: 0,
                numberOfTransactions: 0
              };
              setActiveShift(newShift);
              localStorage.setItem('activeShift', JSON.stringify(newShift));
              
              const existingShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
              localStorage.setItem('shifts', JSON.stringify([...existingShifts, newShift]));
              
              toast({
                title: "Shift Started",
                description: "Your work shift has begun.",
              });
            }}
            onEndShift={() => {
              if (!activeShift) return;
              
              const shiftSales = JSON.parse(localStorage.getItem('sales') || '[]')
                .filter((sale: any) => {
                  const saleDate = new Date(sale.date);
                  const shiftStart = new Date(activeShift.startTime);
                  return saleDate >= shiftStart;
                });
              
              const shiftTotal = shiftSales.reduce((acc: number, sale: any) => acc + sale.total, 0);
              
              const existingShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
              const updatedShifts = existingShifts.map((shift: Shift) => {
                if (shift.id === activeShift.id) {
                  return {
                    ...shift,
                    endTime: new Date().toISOString(),
                    totalSales: shiftTotal,
                    numberOfTransactions: shiftSales.length
                  };
                }
                return shift;
              });
              
              localStorage.setItem('shifts', JSON.stringify(updatedShifts));
              localStorage.removeItem('activeShift');
              setActiveShift(null);
              
              toast({
                title: "Shift Ended",
                description: `Total sales: $${shiftTotal.toFixed(2)} | Transactions: ${shiftSales.length}`,
              });
            }}
          />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <ProductsSection products={products} addToCart={addToCart} />
              <SavedSalesTab
                savedSales={savedSales}
                onLoadSale={handleLoadSale}
                onNewSale={handleNewSale}
              />
            </div>
            <CartSection
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              getTotalAmount={getTotalAmount}
              handleCheckout={handleCheckout}
              onSaveSale={handleSaveSale}
              onDeleteSale={handleDeleteSale}
              currentSavedSale={currentSavedSaleId ? savedSales.find(sale => sale.id === currentSavedSaleId) : null}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
