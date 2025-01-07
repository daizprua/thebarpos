import { Button } from "@/components/ui/button";
import { SaveSaleDialog } from "./SaveSaleDialog";
import { CartItem, SavedSale } from "@/types/pos";
import { Save } from "lucide-react";

interface PaymentSectionProps {
  totalAmount: number;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  cashReceived: string;
  setCashReceived: (value: string) => void;
  handleCheckout: () => void;
  cart: CartItem[];
  onSaveSale: (clientName: string) => void;
  currentSavedSale?: SavedSale | null;
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
  currentSavedSale,
}: PaymentSectionProps) {
  const handleQuickUpdate = () => {
    if (currentSavedSale) {
      onSaveSale(currentSavedSale.clientName);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className={`flex-1 ${
              paymentMethod === "efectivo" ? "bg-primary text-primary-foreground" : ""
            }`}
            onClick={() => setPaymentMethod("efectivo")}
          >
            Efectivo
          </Button>
          <Button
            type="button"
            variant="outline"
            className={`flex-1 ${
              paymentMethod === "tarjeta" ? "bg-primary text-primary-foreground" : ""
            }`}
            onClick={() => setPaymentMethod("tarjeta")}
          >
            Tarjeta
          </Button>
          <Button
            type="button"
            variant="outline"
            className={`flex-1 ${
              paymentMethod === "yappy" ? "bg-primary text-primary-foreground" : ""
            }`}
            onClick={() => setPaymentMethod("yappy")}
          >
            Yappy
          </Button>
        </div>

        {paymentMethod === "efectivo" && (
          <div className="space-y-2">
            <label htmlFor="cashReceived" className="text-sm font-medium text-white">
              Cash Received
            </label>
            <input
              id="cashReceived"
              type="number"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
              placeholder="Enter amount"
            />
            {cashReceived && (
              <div className="text-sm">
                <span className="text-gray-400">Change: </span>
                <span className="font-medium text-white">
                  ${(Number(cashReceived) - totalAmount).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          className="w-full"
          onClick={handleCheckout}
          disabled={
            !paymentMethod ||
            (paymentMethod === "efectivo" &&
              (!cashReceived || parseFloat(cashReceived) < totalAmount))
          }
        >
          Checkout (${totalAmount.toFixed(2)})
        </Button>
      </div>

      <div className="flex gap-2">
        {currentSavedSale ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleQuickUpdate}
          >
            <Save className="w-4 h-4 mr-2" />
            Update Sale for {currentSavedSale.clientName}
          </Button>
        ) : (
          <SaveSaleDialog
            cart={cart}
            total={totalAmount}
            onSave={onSaveSale}
            currentSavedSale={currentSavedSale}
          />
        )}
      </div>
    </div>
  );
}