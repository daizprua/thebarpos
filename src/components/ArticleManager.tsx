import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Save, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Article {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

export const ArticleManager = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1649972904349-6e44c42644a7");
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    if (!title || !content) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      // Update existing article
      setArticles(articles.map(article => 
        article.id === editingId 
          ? { ...article, title, content, imageUrl }
          : article
      ));
      setEditingId(null);
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
    } else {
      // Create new article
      const newArticle: Article = {
        id: articles.length + 1,
        title,
        content,
        imageUrl,
      };
      setArticles([...articles, newArticle]);
      toast({
        title: "Success",
        description: "Article saved successfully",
      });
    }

    // Reset form
    setTitle("");
    setContent("");
    setImageUrl("https://images.unsplash.com/photo-1649972904349-6e44c42644a7");
  };

  const handleEdit = (article: Article) => {
    setTitle(article.title);
    setContent(article.content);
    setImageUrl(article.imageUrl);
    setEditingId(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card backdrop-blur-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">
          {editingId ? "Edit Article" : "Create New Article"}
        </h3>
        <div className="space-y-4">
          <Input
            placeholder="Article Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background/50 text-white"
          />
          <Textarea
            placeholder="Article Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-background/50 text-white min-h-[120px]"
          />
          <div className="flex gap-4">
            <Button
              className="bg-secondary hover:bg-secondary/80"
              onClick={() => document.getElementById("imageInput")?.click()}
            >
              <ImagePlus className="mr-2" />
              Add Image
            </Button>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  toast({
                    title: "Image Upload Simulated",
                    description: "In a real app, this would upload to a server",
                  });
                }
              }}
            />
            <Button onClick={handleSave}>
              <Save className="mr-2" />
              {editingId ? "Update Article" : "Save Article"}
            </Button>
            {editingId && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setContent("");
                  setImageUrl("https://images.unsplash.com/photo-1649972904349-6e44c42644a7");
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
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-white mb-2">{article.title}</h4>
                <p className="text-gray-300 line-clamp-3 mb-4">{article.content}</p>
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