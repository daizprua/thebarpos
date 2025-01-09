import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductImage } from "./ProductImage";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ProductEditFormProps {
  editForm: any;
  onInputChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProductEditForm = ({ editForm, onInputChange, onSave, onCancel }: ProductEditFormProps) => {
  return (
    <>
      <td className="p-4">
        <div className="space-y-2">
          <ProductImage
            imageUrl={editForm?.imageUrl}
            onImageChange={(url) => onInputChange('imageUrl', url)}
            onImageRemove={() => onInputChange('imageUrl', '')}
            isEditing
          />
          <Input
            value={editForm?.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            className="max-w-[200px] w-full"
          />
        </div>
      </td>
      <td className="p-4">
        <Input
          value={editForm?.category}
          onChange={(e) => onInputChange('category', e.target.value)}
          className="max-w-[150px] w-full"
        />
      </td>
      <td className="p-4">
        <Input
          type="number"
          value={editForm?.quantity}
          onChange={(e) => onInputChange('quantity', e.target.value)}
          className="max-w-[100px] w-full"
        />
      </td>
      <td className="p-4">
        <Input
          type="number"
          value={editForm?.price}
          onChange={(e) => onInputChange('price', e.target.value)}
          className="max-w-[100px] w-full"
        />
      </td>
      <td className="p-4">
        {editForm && (
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" size="sm" className="w-full sm:w-auto">
                  Save
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Save Changes</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to save these changes? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onSave}>Save Changes</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline" size="sm" onClick={onCancel} className="w-full sm:w-auto">
              Cancel
            </Button>
          </div>
        )}
      </td>
    </>
  );
};