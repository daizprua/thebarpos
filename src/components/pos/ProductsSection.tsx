import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/pos";

interface ProductsSectionProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

export function ProductsSection({ products, addToCart }: ProductsSectionProps) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product) => (
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