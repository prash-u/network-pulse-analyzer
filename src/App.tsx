import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Workspace from "./pages/Workspace.tsx";
import Datasets from "./pages/Datasets.tsx";
import Methods from "./pages/Methods.tsx";
import Docs from "./pages/Docs.tsx";
import Intake from "./pages/Intake.tsx";
import NotFound from "./pages/NotFound.tsx";
import Discovery from "./pages/Discovery.tsx";
import Evidence from "./pages/Evidence.tsx";
import Simulate from "./pages/Simulate.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/datasets" element={<Datasets />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/methods" element={<Methods />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/evidence" element={<Evidence />} />
          <Route path="/simulate" element={<Simulate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
