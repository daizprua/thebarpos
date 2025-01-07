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
import { SavedSale } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";

interface SaveSaleDialogProps {
  onSave: (clientName: string) => void;
  onDelete?: (saleId: number) => void;
  currentSavedSale?: SavedSale | null;
  isAdmin?: boolean;
}

export function SaveSaleDialog({ onSave, onDelete, currentSavedSale, isAdmin }: SaveSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const { toast } = useToast();

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

  const handleDelete = () => {
    if (currentSavedSale && onDelete) {
      onDelete(currentSavedSale.id);
      setOpen(false);
    }
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
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              {currentSavedSale ? 'Update Sale' : 'Save Sale'}
            </Button>
            {currentSavedSale && isAdmin && onDelete && (
              <Button onClick={handleDelete} variant="destructive">
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}