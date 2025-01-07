import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Save } from "lucide-react";
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

    const newArticle: Article = {
      id: articles.length + 1,
      title,
      content,
      imageUrl,
    };

    setArticles([...articles, newArticle]);
    setTitle("");
    setContent("");
    setImageUrl("https://images.unsplash.com/photo-1649972904349-6e44c42644a7");

    toast({
      title: "Success",
      description: "Article saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card backdrop-blur-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Create New Article</h3>
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
                  // In a real application, you would upload the file to a server
                  // For now, we'll just use the placeholder image
                  toast({
                    title: "Image Upload Simulated",
                    description: "In a real app, this would upload to a server",
                  });
                }
              }}
            />
            <Button onClick={handleSave}>
              <Save className="mr-2" />
              Save Article
            </Button>
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
                <p className="text-gray-300 line-clamp-3">{article.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};