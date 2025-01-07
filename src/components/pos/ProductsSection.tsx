import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/pos";
import { Link } from "react-router-dom";
import { Package, Search } from "lucide-react";
import { useState } from "react";

interface ProductsSectionProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

export function ProductsSection({ products, addToCart }: ProductsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Products</h2>
        <Button variant="secondary" asChild>
          <Link to="/">
            <Package className="mr-2 h-4 w-4" />
            Manage Inventory
          </Link>
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full bg-card/50 backdrop-blur-lg border-0"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-card/50 backdrop-blur-lg border-0">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {product.category}
                    </Badge>
                  </div>
                  <span className="text-lg font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <Button
                  className="w-full mt-2"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}