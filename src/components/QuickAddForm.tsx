import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export const QuickAddForm = () => {
  const [category, setCategory] = useState("");

  return (
    <div className="card-base">
      <h3 className="section-title">Quick Add Inventory</h3>
      <div className="flex gap-4">
        <Input placeholder="Item name" className="form-input" />
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
        <Input type="number" placeholder="Stock" className="form-input" />
        <Button className="primary-button">Add Item</Button>
      </div>
    </div>
  );
};