import { Button } from "@/components/ui/button";
import { Package, Store, BarChart, Home, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function ProfessionalMenu() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-card/50 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link 
                to="/" 
                className={`flex items-center gap-2 ${currentPath === "/" ? "text-primary" : ""}`}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link 
                to="/pos" 
                className={`flex items-center gap-2 ${currentPath === "/pos" ? "text-primary" : ""}`}
              >
                <Store className="h-5 w-5" />
                <span>POS</span>
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link 
                to="/statistics" 
                className={`flex items-center gap-2 ${currentPath === "/statistics" ? "text-primary" : ""}`}
              >
                <BarChart className="h-5 w-5" />
                <span>Statistics</span>
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link 
                to="/inventory" 
                className={`flex items-center gap-2 ${currentPath === "/inventory" ? "text-primary" : ""}`}
              >
                <Package className="h-5 w-5" />
                <span>Inventory</span>
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link 
                to="/control-panel" 
                className={`flex items-center gap-2 ${currentPath === "/control-panel" ? "text-primary" : ""}`}
              >
                <Settings className="h-5 w-5" />
                <span>Control Panel</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}