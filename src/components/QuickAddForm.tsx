import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export const QuickAddForm = () => {
  const [category, setCategory] = useState("");

  return (
    <div className="card-base">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Quick Add Inventory</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="Item name" className="form-input flex-1" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="form-input">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="spirits">Spirits</SelectItem>
            <SelectItem value="beer">Beer</SelectItem>
            <SelectItem value="wine">Wine</SelectItem>
            <SelectItem value="mixers">Mixers</SelectItem>
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Stock" className="form-input w-full sm:w-32" />
        <Button className="primary-button w-full sm:w-auto">Add Item</Button>
      </div>
    </div>
  );
};