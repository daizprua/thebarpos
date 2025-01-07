import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProfessionalMenu } from "@/components/ProfessionalMenu";
import Index from "./pages/Index";
import Pos from "./pages/Pos";
import Statistics from "./pages/Statistics";
import ControlPanel from "./pages/ControlPanel";

const queryClient = new QueryClient();

const App = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (user?.role === 'cajero') {
      return <Navigate to="/pos" />;
    }
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ProfessionalMenu />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/pos" element={<Pos />} />
            <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/control-panel" element={<ProtectedRoute><ControlPanel /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;