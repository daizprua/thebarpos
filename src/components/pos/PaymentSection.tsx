import { Button } from "@/components/ui/button";

interface PaymentSectionProps {
  selectedMethod: string;
  onPaymentMethodSelect: (method: string) => void;
}

export function PaymentSection({
  selectedMethod,
  onPaymentMethodSelect,
}: PaymentSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Button
        variant={selectedMethod === "cash" ? "default" : "outline"}
        onClick={() => onPaymentMethodSelect("cash")}
        className="w-full"
      >
        Cash
      </Button>
      <Button
        variant={selectedMethod === "card" ? "default" : "outline"}
        onClick={() => onPaymentMethodSelect("card")}
        className="w-full"
      >
        Card
      </Button>
      <Button
        variant={selectedMethod === "yappy" ? "default" : "outline"}
        onClick={() => onPaymentMethodSelect("yappy")}
        className="w-full"
      >
        Yappy
      </Button>
    </div>
  );
}