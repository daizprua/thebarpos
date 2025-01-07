import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CartItem, SavedSale } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";

interface SaveSaleDialogProps {
  cart: CartItem[];
  total: number;
  onSave: (clientName: string) => void;
  currentSavedSale?: SavedSale | null;
}

export function SaveSaleDialog({ cart, total, onSave, currentSavedSale }: SaveSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const { toast } = useToast();

  // Set the client name when editing an existing sale
  useEffect(() => {
    if (currentSavedSale) {
      setClientName(currentSavedSale.clientName);
    }
  }, [currentSavedSale]);

  const handleSave = () => {
    if (!clientName.trim()) {
      toast({
        variant: "destructive",
        title: "Client name required",
        description: "Please enter a client name to save the sale.",
      });
      return;
    }
    onSave(clientName);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {currentSavedSale ? 'Update Sale' : 'Save for Later'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentSavedSale ? 'Update Sale' : 'Save Sale for Later'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="clientName" className="text-sm font-medium">
              Client Name
            </label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              className="mt-1"
            />
          </div>
          <div className="pt-2">
            <div className="flex justify-between mb-2">
              <span>Total Amount:</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Items:</span>
              <span className="font-semibold">{cart.length}</span>
            </div>
          </div>
          <Button onClick={handleSave} className="w-full">
            {currentSavedSale ? 'Update Sale' : 'Save Sale'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}