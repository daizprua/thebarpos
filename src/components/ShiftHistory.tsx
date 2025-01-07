import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { Shift } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";

export function ShiftHistory() {
  const [shifts, setShifts] = useState<Shift[]>(() => {
    try {
      const savedShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
      return Array.isArray(savedShifts) ? savedShifts : [];
    } catch {
      return [];
    }
  });

  const { toast } = useToast();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleDeleteShift = (shiftId: number) => {
    if (user?.role !== 'admin') return;
    
    const updatedShifts = shifts.filter(shift => shift.id !== shiftId);
    localStorage.setItem('shifts', JSON.stringify(updatedShifts));
    setShifts(updatedShifts);
    
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    const updatedSales = existingSales.filter((sale: any) => sale.shiftId !== shiftId);
    localStorage.setItem('sales', JSON.stringify(updatedSales));
    
    toast({
      title: "Shift Deleted",
      description: "The shift and its associated sales have been deleted.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <span>Shift History</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Shift History</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  {new Date(shift.startTime).toLocaleDateString()} {" "}
                  {new Date(shift.startTime).toLocaleTimeString()}
                </span>
                <div className="flex gap-2 items-center">
                  <span className="text-muted-foreground">
                    {shift.endTime ? `Ended: ${new Date(shift.endTime).toLocaleTimeString()}` : "Active"}
                  </span>
                  {user?.role === 'admin' && shift.endTime && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteShift(shift.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Initial Cash</p>
                  <p className="font-medium">${(shift.initialCash || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Sales</p>
                  <p className="font-medium">${(shift.totalSales || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Transactions</p>
                  <p className="font-medium">{shift.numberOfTransactions || 0}</p>
                </div>
              </div>
            </div>
          ))}
          {shifts.length === 0 && (
            <p className="text-center text-muted-foreground">No shift history available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}