import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AperInsud from "./pages/AperInsud";
import NotFound from "./pages/NotFound";
import ArticleSubmission from './pages/ArticleSubmission';
import LuminaDynamic from './pages/LuminaDynamic';
import ArticleDynamicPage from './pages/ArticleDynamicPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/aperinsud" element={<AperInsud />} />
          <Route path="/lumina" element={<LuminaDynamic />} />
          <Route path="/lumina/:slug" element={<ArticleDynamicPage />} />
          <Route path="/lumina/submit" element={<ArticleSubmission />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
