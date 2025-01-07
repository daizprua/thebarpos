import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProfessionalMenu } from "@/components/ProfessionalMenu";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Pos from "./pages/Pos";
import Statistics from "./pages/Statistics";
import ControlPanel from "./pages/ControlPanel";

const queryClient = new QueryClient();

const App = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/" />;
    }
    if (user.role === 'cajero') {
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
          {user && <ProfessionalMenu />}
          <Routes>
            <Route path="/" element={user ? (
              user.role === 'admin' ? <Navigate to="/inventory" /> : <Navigate to="/pos" />
            ) : <Login />} />
            <Route path="/pos" element={user ? <Pos /> : <Navigate to="/" />} />
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