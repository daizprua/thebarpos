import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { CartItem } from "@/types/pos";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CartItemListProps {
  cart: CartItem[];
  updateQuantity: (productId: number, change: number) => void;
  removeFromCart: (productId: number) => void;
}

export function CartItemList({
  cart,
  updateQuantity,
  removeFromCart,
}: CartItemListProps) {
  return (
    <ScrollArea className="h-[400px] pr-4">
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-start justify-between py-4 border-b border-gray-700"
        >
          <div className="flex gap-3 flex-1">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-12 h-12 rounded object-cover"
              />
            )}
            <div>
              <h3 className="font-medium text-white">{item.name}</h3>
              <p className="text-sm text-gray-400">
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, -1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-white">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              onClick={() => removeFromCart(item.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}