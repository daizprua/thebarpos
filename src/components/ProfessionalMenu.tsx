import { Button } from "@/components/ui/button";
import { Package, Store, BarChart, Home, Settings, LogOut, History, Receipt } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function ProfessionalMenu() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { toast } = useToast();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  const activeShiftStr = localStorage.getItem('activeShift');
  const activeShift = activeShiftStr ? JSON.parse(activeShiftStr) : null;

  const handleRestrictedAccess = (e: React.MouseEvent) => {
    if (user?.role === 'cajero') {
      e.preventDefault();
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this section.",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    window.location.href = '/';
  };

  return (
    <nav className="bg-card/50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {activeShift && (
              <span className="text-sm text-muted-foreground">
                Shift started by: {activeShift.startedBy}
              </span>
            )}
            <Button variant="ghost" asChild>
              <Link 
                to="/" 
                className={`flex items-center gap-2 ${currentPath === "/" ? "text-primary" : ""}`}
                onClick={handleRestrictedAccess}
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
                to="/sales-history" 
                className={`flex items-center gap-2 ${currentPath === "/sales-history" ? "text-primary" : ""}`}
              >
                <Receipt className="h-5 w-5" />
                <span>Sales History</span>
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link 
                to="/expense-history" 
                className={`flex items-center gap-2 ${currentPath === "/expense-history" ? "text-primary" : ""}`}
              >
                <History className="h-5 w-5" />
                <span>Expense History</span>
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link 
                to="/statistics" 
                className={`flex items-center gap-2 ${currentPath === "/statistics" ? "text-primary" : ""}`}
                onClick={handleRestrictedAccess}
              >
                <BarChart className="h-5 w-5" />
                <span>Statistics</span>
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link 
                to="/inventory" 
                className={`flex items-center gap-2 ${currentPath === "/inventory" ? "text-primary" : ""}`}
                onClick={handleRestrictedAccess}
              >
                <Package className="h-5 w-5" />
                <span>Inventory</span>
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link 
                to="/control-panel" 
                className={`flex items-center gap-2 ${currentPath === "/control-panel" ? "text-primary" : ""}`}
                onClick={handleRestrictedAccess}
              >
                <Settings className="h-5 w-5" />
                <span>Control Panel</span>
              </Link>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}