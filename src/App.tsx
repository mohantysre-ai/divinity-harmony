import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MantrasPage from "./pages/MantrasPage";
import LiveDarshan from "./pages/LiveDarshan";
import SacredTexts from "./pages/SacredTexts";
import UserSettings from "./pages/UserSettings";
import SplashScreen from "./components/auth/SplashScreen";
import DeitiesPage from "./pages/DeitiesPage";
import TemplesPage from "./pages/TemplesPage";
import PriestDirectoryPage from "./pages/PriestDirectoryPage";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  // Check if user has seen the splash screen before
  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);
  
  // Set splash as seen when navigating away
  const handleSplashComplete = () => {
    localStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {showSplash && (
              <Route path="/" element={<SplashScreen onComplete={handleSplashComplete} />} />
            )}
            <Route path="/" element={<Index />} />
            <Route path="/mantras" element={<MantrasPage />} />
            <Route path="/darshan" element={<LiveDarshan />} />
            <Route path="/pdf-reader" element={<SacredTexts />} />
            <Route path="/scriptures" element={<SacredTexts />} />
            <Route path="/deities" element={<DeitiesPage />} />
            <Route path="/deities/:slug" element={<DeitiesPage />} />
            <Route path="/temples" element={<TemplesPage />} />
            <Route path="/priests" element={<PriestDirectoryPage />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/login" element={<SplashScreen />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
