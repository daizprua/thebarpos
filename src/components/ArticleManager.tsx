import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Pencil, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Article {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export const ArticleManager = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
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

    if (editingId) {
      setArticles(articles.map(article => 
        article.id === editingId 
          ? { ...article, name, category, quantity: numericQuantity, price: numericPrice, imageUrl }
          : article
      ));
      setEditingId(null);
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
    } else {
      const newArticle: Article = {
        id: articles.length + 1,
        name,
        category,
        quantity: numericQuantity,
        price: numericPrice,
        imageUrl,
      };
      setArticles([...articles, newArticle]);
      toast({
        title: "Success",
        description: "Article saved successfully",
      });
    }

    // Reset form
    setName("");
    setCategory("");
    setQuantity("");
    setPrice("");
    setImageUrl("");
  };

  const handleEdit = (article: Article) => {
    setName(article.name);
    setCategory(article.category);
    setQuantity(article.quantity.toString());
    setPrice(article.price.toString());
    setImageUrl(article.imageUrl || "");
    setEditingId(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card backdrop-blur-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          {editingId ? "Edit Article" : "Create New Article"}
        </h3>
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
          <div className="flex gap-4">
            <Button onClick={handleSave}>
              <Save className="mr-2" />
              {editingId ? "Update Article" : "Save Article"}
            </Button>
            {editingId && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setCategory("");
                  setQuantity("");
                  setPrice("");
                  setImageUrl("");
                }}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="rounded-lg border bg-card backdrop-blur-lg overflow-hidden"
            >
              {article.imageUrl && (
                <div className="w-full h-48">
                  <img 
                    src={article.imageUrl} 
                    alt={article.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="text-lg font-semibold text-white mb-2">{article.name}</h4>
                <p className="text-gray-300 mb-1">Category: {article.category}</p>
                <p className="text-gray-300 mb-1">Quantity: {article.quantity}</p>
                <p className="text-gray-300 mb-4">Price: ${article.price.toFixed(2)}</p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleEdit(article)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};