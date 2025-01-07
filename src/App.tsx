import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProfessionalMenu } from "@/components/ProfessionalMenu";
import Login from "@/pages/Login";
import Pos from "@/pages/Pos";
import Index from "@/pages/Index";
import Statistics from "@/pages/Statistics";
import ControlPanel from "@/pages/ControlPanel";
import SalesHistory from "@/pages/SalesHistory";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {user && <ProfessionalMenu />}
          <Routes>
            <Route path="/" element={user ? (
              <Navigate to="/pos" replace />
            ) : (
              <Navigate to="/login" replace />
            )} />
            <Route path="/login" element={<Login />} />
            <Route path="/pos" element={<ProtectedRoute><Pos /></ProtectedRoute>} />
            <Route path="/sales-history" element={<ProtectedRoute><SalesHistory /></ProtectedRoute>} />
            <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/control-panel" element={<ProtectedRoute><ControlPanel /></ProtectedRoute>} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;