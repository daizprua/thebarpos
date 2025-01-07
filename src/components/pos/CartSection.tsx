import { ShoppingCart } from "lucide-react";
import { CartItem } from "@/types/pos";
import { useState } from "react";
import { CartItemList } from "./CartItemList";
import { PaymentSection } from "./PaymentSection";

interface CartSectionProps {
  cart: CartItem[];
  updateQuantity: (productId: number, change: number) => void;
  removeFromCart: (productId: number) => void;
  getTotalAmount: () => number;
  handleCheckout: () => void;
}

export function CartSection({
  cart,
  updateQuantity,
  removeFromCart,
  getTotalAmount,
  handleCheckout,
}: CartSectionProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("efectivo");
  const [currentPage, setCurrentPage] = useState(1);
  const [cashReceived, setCashReceived] = useState<string>("");
  const itemsPerPage = 12;

  const totalAmount = getTotalAmount();
  const totalPages = Math.ceil(cart.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cart.slice(startIndex, endIndex);

  const handlePaymentAndCheckout = () => {
    if (!paymentMethod) {
      return;
    }
    handleCheckout();
  };

  return (
    <div className="lg:w-1/3">
      <div className="bg-card/80 backdrop-blur-lg rounded-lg p-6 sticky top-8 shadow-lg border border-gray-700/50 ring-1 ring-white/10">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-6 w-6 text-white" />
          <h2 className="text-2xl font-bold text-white">Cart</h2>
        </div>

        <CartItemList
          currentItems={currentItems}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />

        <PaymentSection
          totalAmount={totalAmount}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          cashReceived={cashReceived}
          setCashReceived={setCashReceived}
          handleCheckout={handlePaymentAndCheckout}
        />
      </div>
    </div>
  );
}