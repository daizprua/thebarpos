import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveSaleDialog } from "./SaveSaleDialog";
import { CartItem, SavedSale } from "@/types/pos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between text-lg font-semibold text-white">
        <span>Total:</span>
        <span>${totalAmount.toFixed(2)}</span>
      </div>

      <div className="space-y-4">
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="bg-background/50 text-white">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="efectivo">Cash</SelectItem>
            <SelectItem value="tarjeta">Card</SelectItem>
            <SelectItem value="yappy">Yappy</SelectItem>
          </SelectContent>
        </Select>

        {paymentMethod === "efectivo" && (
          <div className="space-y-2">
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