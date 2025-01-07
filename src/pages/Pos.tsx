import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProductsSection } from "@/components/pos/ProductsSection";
import { CartSection } from "@/components/pos/CartSection";
import { ShiftControls } from "@/components/pos/ShiftControls";
import { Product, CartItem } from "@/types/pos";

const mockProducts: Product[] = [
  { id: 1, name: "Grey Goose Vodka", category: "Spirits", price: 29.99 },
  { id: 2, name: "Heineken", category: "Beer", price: 4.99 },
  { id: 3, name: "Dom Pérignon", category: "Wine", price: 199.99 },
  { id: 4, name: "Coca-Cola", category: "Mixers", price: 2.99 },
  { id: 5, name: "Jack Daniel's", category: "Spirits", price: 25.99 },
  { id: 6, name: "Corona", category: "Beer", price: 3.99 },
  { id: 7, name: "Red Bull", category: "Mixers", price: 3.99 },
  { id: 8, name: "Moet", category: "Wine", price: 49.99 },
];

const Pos = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeShift, setActiveShift] = useState<{
    startTime: string;
    id: number;
  } | null>(() => {
    const saved = localStorage.getItem('activeShift');
    return saved ? JSON.parse(saved) : null;
  });
  const { toast } = useToast();

  const startShift = (initialCash: number) => {
    const newShift = {
      startTime: new Date().toISOString(),
      id: Date.now(),
      initialCash
    };
    setActiveShift(newShift);
    localStorage.setItem('activeShift', JSON.stringify(newShift));
    toast({
      title: "Shift Started",
      description: "Your work shift has begun.",
    });
  };

  const endShift = () => {
    if (!activeShift) return;
    
    const shiftSales = JSON.parse(localStorage.getItem('sales') || '[]')
      .filter((sale: any) => {
        const saleDate = new Date(sale.date);
        const shiftStart = new Date(activeShift.startTime);
        return saleDate >= shiftStart;
      });
    
    const shiftTotal = shiftSales.reduce((acc: number, sale: any) => acc + sale.total, 0);
    
    const shiftRecord = {
      ...activeShift,
      endTime: new Date().toISOString(),
      totalSales: shiftTotal,
      numberOfTransactions: shiftSales.length
    };

    const existingShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
    localStorage.setItem('shifts', JSON.stringify([...existingShifts, shiftRecord]));
    
    localStorage.removeItem('activeShift');
    setActiveShift(null);
    
    toast({
      title: "Shift Ended",
      description: `Total sales: $${shiftTotal.toFixed(2)} | Transactions: ${shiftSales.length}`,
    });
  };

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
            onStartShift={startShift}
            onEndShift={endShift}
          />
          <div className="flex flex-col lg:flex-row gap-8">
            <ProductsSection products={mockProducts} addToCart={addToCart} />
            <CartSection
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              getTotalAmount={getTotalAmount}
              handleCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pos;
