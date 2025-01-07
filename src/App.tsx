import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfessionalMenu } from "@/components/ProfessionalMenu";
import Index from "./pages/Index";
import Pos from "./pages/Pos";
import Statistics from "./pages/Statistics";
import ControlPanel from "./pages/ControlPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ProfessionalMenu />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pos" element={<Pos />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/inventory" element={<Index />} />
          <Route path="/control-panel" element={<ControlPanel />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;