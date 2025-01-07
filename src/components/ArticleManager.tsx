import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Article {
  name: string;
  category: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface ArticleManagerProps {
  onSaveArticle: (article: Article) => void;
}

export const ArticleManager = ({ onSaveArticle }: ArticleManagerProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name || !category || !quantity || !price) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const numericQuantity = parseInt(quantity);
    const numericPrice = parseFloat(price);

    if (isNaN(numericQuantity) || isNaN(numericPrice)) {
      toast({
        title: "Invalid Input",
        description: "Quantity and price must be valid numbers",
        variant: "destructive",
      });
      return;
    }

    onSaveArticle({
      name,
      category,
      quantity: numericQuantity,
      price: numericPrice,
      imageUrl,
    });

    toast({
      title: "Success",
      description: "Article saved successfully",
    });

    // Reset form
    setName("");
    setCategory("");
    setQuantity("");
    setPrice("");
    setImageUrl("");
  };

  return (
    <div className="rounded-lg border bg-card backdrop-blur-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white mb-2">Create New Article</h3>
      <div className="space-y-4">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-background/50 text-white"
        />
        <Input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-background/50 text-white"
        />
        <Input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="bg-background/50 text-white"
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-background/50 text-white"
        />
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="bg-background/50 text-white"
          />
          {imageUrl && (
            <div className="mt-2">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2" />
          Save Article
        </Button>
      </div>
    </div>
  );
};