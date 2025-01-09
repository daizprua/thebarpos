import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SaveSaleDialog } from "./SaveSaleDialog";
import { CartItem, SavedSale } from "@/types/pos";
import { CartItemList } from "./CartItemList";
import { PaymentSection } from "./PaymentSection";

interface CartSectionProps {
  cart: CartItem[];
  updateQuantity: (productId: number, change: number) => void;
  removeFromCart: (productId: number) => void;
  getTotalAmount: () => number;
  handleCheckout: (paymentMethod: string) => void;
  onSaveSale: (clientName: string) => void;
  onDeleteSale: (saleId: number) => void;
  currentSavedSale: SavedSale | null;
  isAdmin: boolean;
}

export function CartSection({
  cart,
  updateQuantity,
  removeFromCart,
  getTotalAmount,
  handleCheckout,
  onSaveSale,
  onDeleteSale,
  currentSavedSale,
  isAdmin
}: CartSectionProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");

  return (
    <div className="w-full lg:w-1/3 bg-gradient-to-br from-secondary/30 to-accent/20 backdrop-blur-lg rounded-lg p-6 space-y-6 h-fit border border-secondary/20">
      <h2 className="text-2xl font-bold text-white">Cart</h2>
      <CartItemList
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
      <div className="pt-4 border-t border-secondary/30">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-white">Total:</span>
          <span className="text-lg font-bold text-white">${getTotalAmount().toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <PaymentSection
            onPaymentMethodSelect={setSelectedPaymentMethod}
            selectedMethod={selectedPaymentMethod}
          />
          <Button
            className="w-full bg-accent hover:bg-accent/90 text-white"
            onClick={() => handleCheckout(selectedPaymentMethod)}
            disabled={cart.length === 0}
          >
            Complete Sale
          </Button>
          <SaveSaleDialog
            onSave={onSaveSale}
            onDelete={onDeleteSale}
            currentSavedSale={currentSavedSale}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
}