import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const colorPalettes = {
  default: {
    primary: "#9b87f5",
    secondary: "#7E69AB",
    accent: "#D946EF",
    warning: "#F97316",
    card: "rgba(26, 31, 44, 0.8)",
  },
  pastel: {
    primary: "#E5DEFF",
    secondary: "#FEC6A1",
    accent: "#FFDEE2",
    warning: "#FEF7CD",
    card: "rgba(242, 252, 226, 0.8)",
  },
  vivid: {
    primary: "#8B5CF6",
    secondary: "#0EA5E9",
    accent: "#D946EF",
    warning: "#F97316",
    card: "rgba(26, 31, 44, 0.9)",
  }
};

export const ColorPaletteSelector = () => {
  const { toast } = useToast();
  const [selectedPalette, setSelectedPalette] = useState<keyof typeof colorPalettes>(() => {
    const saved = localStorage.getItem('selectedPalette');
    return (saved as keyof typeof colorPalettes) || 'default';
  });

  const applyPalette = (palette: typeof colorPalettes[keyof typeof colorPalettes]) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', palette.primary);
    root.style.setProperty('--secondary', palette.secondary);
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--warning', palette.warning);
    root.style.setProperty('--card', palette.card);
  };

  useEffect(() => {
    const savedPalette = localStorage.getItem('selectedPalette');
    if (savedPalette) {
      setSelectedPalette(savedPalette as keyof typeof colorPalettes);
      applyPalette(colorPalettes[savedPalette as keyof typeof colorPalettes]);
    } else {
      // Apply default palette if none is saved
      applyPalette(colorPalettes.default);
    }
  }, []);

  const handlePaletteChange = (value: string) => {
    const palette = value as keyof typeof colorPalettes;
    setSelectedPalette(palette);
    localStorage.setItem('selectedPalette', palette);
    applyPalette(colorPalettes[palette]);
    toast({
      title: "Color Palette Updated",
      description: `The ${palette} color palette has been applied.`,
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Color Palette</h2>
      <RadioGroup value={selectedPalette} onValueChange={handlePaletteChange} className="grid gap-4">
        {Object.entries(colorPalettes).map(([key, palette]) => (
          <div key={key} className="flex items-center space-x-4">
            <RadioGroupItem value={key} id={key} />
            <Label htmlFor={key} className="flex-1 capitalize">
              {key}
            </Label>
            <div className="flex gap-2">
              {Object.entries(palette).map(([colorKey, value]) => (
                <div
                  key={colorKey}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: value }}
                  title={`${colorKey}: ${value}`}
                />
              ))}
            </div>
          </div>
        ))}
      </RadioGroup>
    </Card>
  );
};