import { SalesHistory as SalesHistoryComponent } from "@/components/pos/SalesHistory";
import { CustomSaleForm } from "@/components/sales/CustomSaleForm";

export default function SalesHistory() {
  return (
    <div className="min-h-screen bg-[#1A1F2C] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-end">
          <CustomSaleForm />
        </div>
        <SalesHistoryComponent />
      </div>
    </div>
  );
}