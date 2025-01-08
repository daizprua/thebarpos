import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageProps {
  imageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  onImageRemove: () => void;
  isEditing?: boolean;
}

export const ProductImage = ({ imageUrl, onImageChange, onImageRemove, isEditing }: ProductImageProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(imageUrl);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isEditing && !imageUrl) {
    return null;
  }

  return (
    <div className="relative">
      {isEditing ? (
        <div className="space-y-2">
          {previewUrl && (
            <div className="relative w-16 h-16">
              <img
                src={previewUrl}
                alt="Product preview"
                className="w-full h-full object-cover rounded"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={() => {
                  setPreviewUrl(undefined);
                  onImageRemove();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="max-w-[200px]"
            />
          </div>
        </div>
      ) : (
        imageUrl && (
          <div className="w-10 h-10">
            <img
              src={imageUrl}
              alt="Product"
              className="w-full h-full rounded object-cover"
            />
          </div>
        )
      )}
    </div>
  );
};