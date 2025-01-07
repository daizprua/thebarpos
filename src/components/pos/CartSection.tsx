import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { CartItem } from "@/types/pos";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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

        <ScrollArea className="h-[400px] pr-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between py-4 border-b border-gray-700"
            >
              <div className="flex-1">
                <h3 className="font-medium text-white">{item.name}</h3>
                <p className="text-sm text-gray-400">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-white">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => removeFromCart(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between mb-4">
            <span className="text-lg font-semibold text-white">Total:</span>
            <span className="text-lg font-bold text-white">
              ${getTotalAmount().toFixed(2)}
            </span>
          </div>

          <div className="mb-4">
            <h3 className="text-white mb-2">Payment Method</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="efectivo" id="efectivo" />
                <Label htmlFor="efectivo" className="text-white">Efectivo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tarjeta" id="tarjeta" />
                <Label htmlFor="tarjeta" className="text-white">Tarjeta</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yappy" id="yappy" />
                <Label htmlFor="yappy" className="text-white">Yappy</Label>
              </div>
            </RadioGroup>
          </div>

          <Button 
            className="w-full" 
            size="lg" 
            onClick={handlePaymentAndCheckout}
            disabled={!paymentMethod}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}