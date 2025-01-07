import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const ColorCustomizationCard = () => {
  const { toast } = useToast();
  const [colors, setColors] = useState({
    primary: "#9b87f5",
    secondary: "#7E69AB",
    accent: "#D946EF",
    warning: "#F97316",
    card: "rgba(26, 31, 44, 0.8)",
  });

  useEffect(() => {
    const savedColors = localStorage.getItem('customColors');
    if (savedColors) {
      setColors(JSON.parse(savedColors));
      applyColors(JSON.parse(savedColors));
    }
  }, []);

  const handleColorChange = (colorKey: keyof typeof colors, value: string) => {
    const newColors = { ...colors, [colorKey]: value };
    setColors(newColors);
  };

  const applyColors = (newColors: typeof colors) => {
    document.documentElement.style.setProperty('--primary', newColors.primary);
    document.documentElement.style.setProperty('--secondary', newColors.secondary);
    document.documentElement.style.setProperty('--accent', newColors.accent);
    document.documentElement.style.setProperty('--warning', newColors.warning);
    document.documentElement.style.setProperty('--card', newColors.card);
  };

  const handleSave = () => {
    localStorage.setItem('customColors', JSON.stringify(colors));
    applyColors(colors);
    toast({
      title: "Colors updated",
      description: "The new color scheme has been saved and applied.",
    });
  };

  const handleReset = () => {
    const defaultColors = {
      primary: "#9b87f5",
      secondary: "#7E69AB",
      accent: "#D946EF",
      warning: "#F97316",
      card: "rgba(26, 31, 44, 0.8)",
    };
    setColors(defaultColors);
    localStorage.removeItem('customColors');
    applyColors(defaultColors);
    toast({
      title: "Colors reset",
      description: "The color scheme has been reset to default values.",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Color Customization</h2>
      <div className="grid gap-4">
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="grid gap-2">
            <Label htmlFor={key} className="capitalize">{key} Color</Label>
            <div className="flex gap-2">
              <Input
                id={key}
                type="color"
                value={value}
                onChange={(e) => handleColorChange(key as keyof typeof colors, e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                type="text"
                value={value}
                onChange={(e) => handleColorChange(key as keyof typeof colors, e.target.value)}
                className="flex-1"
                placeholder={`Enter ${key} color value`}
              />
            </div>
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSave} className="flex-1">Save Colors</Button>
          <Button onClick={handleReset} variant="outline" className="flex-1">Reset to Default</Button>
        </div>
      </div>
    </Card>
  );
};