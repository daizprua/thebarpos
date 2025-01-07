import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Expense } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";

interface ExpenseFormProps {
  shiftId: number;
  onAddExpense: (expense: Expense) => void;
}

export function ExpenseForm({ shiftId, onAddExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    const expense: Expense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      shiftId,
      date: new Date().toISOString(),
    };

    onAddExpense(expense);
    setDescription("");
    setAmount("");

    toast({
      title: "Success",
      description: "Expense added successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter expense description"
        />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>
      <Button type="submit" className="w-full">Add Expense</Button>
    </form>
  );
}