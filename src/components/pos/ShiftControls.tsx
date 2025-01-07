import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayCircle, StopCircle, Plus } from "lucide-react";
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
import { Expense, ShiftSummary } from "@/types/pos";
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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [shiftSummary, setShiftSummary] = useState<ShiftSummary | null>(null);
  const { toast } = useToast();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

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
    window.location.reload();
  };

  const canEndShift = activeShift && user?.role === 'admin';

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
    </div>
  );
}