import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";

interface ExcelImportProps {
  onImport: (items: any[]) => void;
}

export const ExcelImport = ({ onImport }: ExcelImportProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate and transform the data
      const transformedData = jsonData.map((item: any, index) => ({
        id: Date.now() + index,
        name: item.name || item.Name || "",
        category: item.category || item.Category || "",
        quantity: Number(item.quantity || item.Quantity || 0),
        threshold: Number(item.threshold || item.Threshold || 5),
        price: Number(item.price || item.Price || 0),
      }));

      onImport(transformedData);
      toast({
        title: "Success",
        description: `Imported ${transformedData.length} items successfully`,
      });
    } catch (error) {
      console.error("Error importing Excel file:", error);
      toast({
        title: "Error",
        description: "Failed to import Excel file. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      // Reset the input
      event.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
        id="excel-upload"
      />
      <label htmlFor="excel-upload">
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={loading}
          asChild
        >
          <span>
            <FileUp className="mr-2 h-4 w-4" />
            Import from Excel
          </span>
        </Button>
      </label>
    </div>
  );
};