import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export const QuickAddForm = () => {
  const [category, setCategory] = useState("");

  return (
    <div className="space-y-4 p-6 backdrop-blur-lg bg-card rounded-lg">
      <h3 className="text-lg font-semibold text-white">Quick Add Inventory</h3>
      <div className="flex gap-4">
        <Input placeholder="Item name" className="bg-background/50 text-white" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-background/50 text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="spirits">Spirits</SelectItem>
            <SelectItem value="beer">Beer</SelectItem>
            <SelectItem value="wine">Wine</SelectItem>
            <SelectItem value="mixers">Mixers</SelectItem>
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Stock" className="bg-background/50 text-white" />
        <Button className="bg-primary hover:bg-primary/90">Add Item</Button>
      </div>
    </div>
  );
};