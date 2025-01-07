import { CartItem } from "@/types/pos";
import { createSale, saveSale } from "@/utils/salesUtils";
import { toast } from "@/hooks/use-toast";

interface CheckoutManagerProps {
  cart: CartItem[];
  getTotalAmount: () => number;
  activeShift: { id: number } | null;
  currentSavedSaleId: number | null;
  savedSales: any[];
  setSavedSales: (sales: any[]) => void;
  setCurrentSavedSaleId: (id: number | null) => void;
  setCart: (cart: CartItem[]) => void;
}

export const handleCheckout = ({
  cart,
  getTotalAmount,
  activeShift,
  currentSavedSaleId,
  savedSales,
  setSavedSales,
  setCurrentSavedSaleId,
  setCart,
}: CheckoutManagerProps) => (paymentMethod: string) => {
  if (!activeShift) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Please start your shift before making sales.",
    });
    return;
  }

  if (cart.length === 0) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Cart is empty",
    });
    return;
  }

  const newSale = createSale(cart, getTotalAmount(), activeShift.id, paymentMethod);
  saveSale(newSale);

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