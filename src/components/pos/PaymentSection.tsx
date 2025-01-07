import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PaymentSectionProps {
  totalAmount: number;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  cashReceived: string;
  setCashReceived: (value: string) => void;
  handleCheckout: () => void;
}

export function PaymentSection({
  totalAmount,
  paymentMethod,
  setPaymentMethod,
  cashReceived,
  setCashReceived,
  handleCheckout,
}: PaymentSectionProps) {
  const change = cashReceived ? parseFloat(cashReceived) - totalAmount : 0;

  const quickAmounts = [
    totalAmount, // Exact amount
    Math.ceil(totalAmount / 10) * 10, // Round up to nearest 10
    Math.ceil(totalAmount / 20) * 20, // Round up to nearest 20
  ].filter((amount, index) => index === 0 || amount > totalAmount); // Keep first amount (exact) and filter others only if greater than total

  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      <div className="flex justify-between mb-4">
        <span className="text-lg font-semibold text-white">Total:</span>
        <span className="text-lg font-bold text-white">
          ${totalAmount.toFixed(2)}
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

      {paymentMethod === "efectivo" && (
        <div className="mb-4 space-y-4">
          <div>
            <Label htmlFor="cashReceived" className="text-white">Cash Received</Label>
            <Input
              id="cashReceived"
              type="number"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              placeholder="Enter amount received"
              className="mt-1"
            />
            <div className="flex gap-2 mt-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setCashReceived(amount.toString())}
                  className="flex-1"
                >
                  ${amount.toFixed(2)}
                </Button>
              ))}
            </div>
          </div>
          {cashReceived && (
            <div className="p-4 bg-card rounded-lg">
              <div className="flex justify-between text-white">
                <span>Change:</span>
                <span className={change >= 0 ? "text-green-500" : "text-red-500"}>
                  ${change.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <Button 
        className="w-full" 
        size="lg" 
        onClick={handleCheckout}
        disabled={!paymentMethod || (paymentMethod === "efectivo" && (!cashReceived || parseFloat(cashReceived) < totalAmount))}
      >
        Checkout
      </Button>
    </div>
  );
}