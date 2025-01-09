import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/pos";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductsSectionProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

export function ProductsSection({ products, addToCart }: ProductsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Products</h2>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full bg-primary/10 backdrop-blur-lg border-0 text-white placeholder:text-gray-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        {currentProducts.map((product) => (
          <Card 
            key={product.id} 
            className="bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-lg border-0 hover:from-primary/30 hover:to-secondary/30 transition-all duration-300"
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <Badge variant="outline" className="mt-1 bg-primary/20 text-primary-foreground border-primary/30">
                      {product.category}
                    </Badge>
                  </div>
                  <span className="text-lg font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <Button
                  className="w-full mt-2 bg-primary hover:bg-primary/90 text-white"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""} text-white`}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className="text-white"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""} text-white`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}