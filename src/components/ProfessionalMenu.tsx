import { Button } from "@/components/ui/button";
import { Package, Store } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function ProfessionalMenu() {
  const location = useLocation();
  const isPos = location.pathname === "/pos";

  return (
    <nav className="bg-card/50 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {isPos ? (
              <Button variant="ghost" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span>Inventory</span>
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link to="/pos" className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  <span>POS</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}