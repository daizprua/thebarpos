import { SalesHistory as SalesHistoryComponent } from "@/components/pos/SalesHistory";

export default function SalesHistory() {
  return (
    <div className="min-h-screen bg-[#1A1F2C] p-8">
      <div className="max-w-7xl mx-auto">
        <SalesHistoryComponent />
      </div>
    </div>
  );
}