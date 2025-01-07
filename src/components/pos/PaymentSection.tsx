import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveSaleDialog } from "./SaveSaleDialog";
import { CartItem, SavedSale } from "@/types/pos";

interface PaymentSectionProps {
  totalAmount: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  cashReceived: string;
  setCashReceived: (amount: string) => void;
  handleCheckout: () => void;
  cart: CartItem[];
  onSaveSale: (clientName: string) => void;
  onDeleteSale?: (saleId: number) => void;
  currentSavedSale?: SavedSale | null;
  isAdmin?: boolean;
}

export function PaymentSection({
  totalAmount,
  paymentMethod,
  setPaymentMethod,
  cashReceived,
  setCashReceived,
  handleCheckout,
  cart,
  onSaveSale,
  onDeleteSale,
  currentSavedSale,
  isAdmin,
}: PaymentSectionProps) {
  const change = cashReceived
    ? parseFloat(cashReceived) - totalAmount
    : 0;

  const quickPaymentAmounts = [totalAmount, 5, 10, 20];
  const handleQuickPayment = (amount: number) => {
    setCashReceived(amount.toFixed(2));
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between text-lg font-semibold text-white">
        <span>Total:</span>
        <span>${totalAmount.toFixed(2)}</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={paymentMethod === "efectivo" ? "default" : "outline"}
            onClick={() => setPaymentMethod("efectivo")}
            className="w-full"
          >
            Cash
          </Button>
          <Button
            variant={paymentMethod === "tarjeta" ? "default" : "outline"}
            onClick={() => setPaymentMethod("tarjeta")}
            className="w-full"
          >
            Card
          </Button>
          <Button
            variant={paymentMethod === "yappy" ? "default" : "outline"}
            onClick={() => setPaymentMethod("yappy")}
            className="w-full"
          >
            Yappy
          </Button>
        </div>

        {paymentMethod === "efectivo" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {quickPaymentAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleQuickPayment(amount)}
                  className="w-full"
                >
                  ${amount.toFixed(2)}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Cash received"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              className="bg-background/50 text-white"
            />
            <div className="flex justify-between text-sm text-white">
              <span>Change:</span>
              <span>${change.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            className="w-full"
            onClick={handleCheckout}
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