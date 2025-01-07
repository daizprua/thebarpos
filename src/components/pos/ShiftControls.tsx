import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayCircle, StopCircle, History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Shift } from "@/types/pos";

interface ShiftControlsProps {
  activeShift: { startTime: string; id: number } | null;
  onStartShift: (initialCash: number) => void;
  onEndShift: () => void;
}

export function ShiftControls({ activeShift, onStartShift, onEndShift }: ShiftControlsProps) {
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [initialCash, setInitialCash] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>(() => {
    try {
      const savedShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
      return Array.isArray(savedShifts) ? savedShifts : [];
    } catch {
      return [];
    }
  });

  // Update shifts state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
        setShifts(Array.isArray(savedShifts) ? savedShifts : []);
      } catch {
        setShifts([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleStartShift = () => {
    const amount = parseFloat(initialCash);
    if (isNaN(amount) || amount < 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid initial cash amount.",
      });
      return;
    }
    onStartShift(amount);
    setShowStartDialog(false);
    setInitialCash("");
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        {!activeShift ? (
          <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                Start Shift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Shift</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="initialCash" className="text-sm font-medium">
                    Initial Cash Amount
                  </label>
                  <Input
                    id="initialCash"
                    type="number"
                    min="0"
                    step="0.01"
                    value={initialCash}
                    onChange={(e) => setInitialCash(e.target.value)}
                    placeholder="Enter initial cash amount"
                  />
                </div>
                <Button onClick={handleStartShift} className="w-full">
                  Start Shift
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Button 
            onClick={onEndShift}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <StopCircle className="h-4 w-4" />
            End Shift
          </Button>
        )}
        {activeShift && (
          <span className="text-white">
            Shift started: {new Date(activeShift.startTime).toLocaleTimeString()}
          </span>
        )}
      </div>
      
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Shift History
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
                  <span className="text-muted-foreground">
                    {shift.endTime ? `Ended: ${new Date(shift.endTime).toLocaleTimeString()}` : "Active"}
                  </span>
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
    </div>
  );
}