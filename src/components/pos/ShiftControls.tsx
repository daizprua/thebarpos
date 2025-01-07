import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayCircle, StopCircle, History, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Shift, Expense, ShiftSummary } from "@/types/pos";
import { ExpenseForm } from "./ExpenseForm";
import { ShiftSummary as ShiftSummaryComponent } from "./ShiftSummary";

interface ShiftControlsProps {
  activeShift: { startTime: string; id: number } | null;
  onStartShift: (initialCash: number) => void;
  onEndShift: () => void;
}

export function ShiftControls({ activeShift, onStartShift, onEndShift }: ShiftControlsProps) {
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showEndShiftDialog, setShowEndShiftDialog] = useState(false);
  const [showConfirmEndDialog, setShowConfirmEndDialog] = useState(false);
  const [initialCash, setInitialCash] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [shiftSummary, setShiftSummary] = useState<ShiftSummary | null>(null);
  const { toast } = useToast();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  const [shifts, setShifts] = useState<Shift[]>(() => {
    try {
      const savedShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
      return Array.isArray(savedShifts) ? savedShifts : [];
    } catch {
      return [];
    }
  });

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
    
    const shiftData = {
      startTime: new Date().toISOString(),
      id: Date.now(),
      initialCash: amount,
      startedBy: user?.username
    };
    localStorage.setItem('activeShift', JSON.stringify(shiftData));
    
    onStartShift(amount);
    setShowStartDialog(false);
    setInitialCash("");
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
    setShowExpenseDialog(false);
  };

  const calculateShiftSummary = async () => {
    if (!activeShift) return;

    const sales = JSON.parse(localStorage.getItem('sales') || '[]')
      .filter((sale: any) => sale.shiftId === activeShift.id);

    const paymentBreakdown = sales.reduce((acc: any, sale: any) => {
      const method = sale.paymentMethod || 'unknown';
      acc[method] = (acc[method] || 0) + sale.total;
      return acc;
    }, {});

    const totalSales = sales.reduce((acc: number, sale: any) => acc + sale.total, 0);
    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    const summary: ShiftSummary = {
      totalSales,
      totalExpenses,
      netTotal: totalSales - totalExpenses,
      paymentBreakdown,
      expenses
    };

    setShiftSummary(summary);
    setShowEndShiftDialog(true);
  };

  const handleEndShiftConfirm = () => {
    if (shiftSummary) {
      setShowConfirmEndDialog(true);
    }
  };

  const handleFinalEndShift = () => {
    onEndShift();
    setShowEndShiftDialog(false);
    setShowConfirmEndDialog(false);
    setExpenses([]);
    setShiftSummary(null);
    toast({
      title: "Shift Ended",
      description: "Your shift has been successfully ended.",
    });
  };

  const canEndShift = activeShift && user?.role === 'admin';

  const handleDeleteShift = (shiftId: number) => {
    if (!user?.role === 'admin') return;
    
    const updatedShifts = shifts.filter(shift => shift.id !== shiftId);
    localStorage.setItem('shifts', JSON.stringify(updatedShifts));
    setShifts(updatedShifts);
    
    // Also delete related sales
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    const updatedSales = existingSales.filter((sale: any) => sale.shiftId !== shiftId);
    localStorage.setItem('sales', JSON.stringify(updatedSales));
    
    toast({
      title: "Shift Deleted",
      description: "The shift and its associated sales have been deleted.",
    });
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
                <DialogDescription>Enter the initial cash amount to start the shift.</DialogDescription>
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
          <>
            <div className="flex gap-4">
              <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                    <DialogDescription>Record a new expense for this shift.</DialogDescription>
                  </DialogHeader>
                  <ExpenseForm shiftId={activeShift.id} onAddExpense={handleAddExpense} />
                </DialogContent>
              </Dialog>

              {canEndShift && (
                <Button 
                  onClick={calculateShiftSummary}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <StopCircle className="h-4 w-4" />
                  End Shift
                </Button>
              )}
            </div>

            <Dialog open={showEndShiftDialog} onOpenChange={setShowEndShiftDialog}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Shift Summary</DialogTitle>
                  <DialogDescription>Review the shift summary before ending the shift.</DialogDescription>
                </DialogHeader>
                {shiftSummary && <ShiftSummaryComponent summary={shiftSummary} />}
                <div className="flex justify-end gap-4 mt-6">
                  <Button variant="outline" onClick={() => setShowEndShiftDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleEndShiftConfirm}>
                    End Shift
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <AlertDialog open={showConfirmEndDialog} onOpenChange={setShowConfirmEndDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently end your shift and save all records.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowConfirmEndDialog(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleFinalEndShift} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    End Shift
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
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
    </div>
  );
}
