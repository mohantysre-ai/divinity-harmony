import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MantrasPage from "./pages/MantrasPage";
import LiveDarshan from "./pages/LiveDarshan";
import SacredTexts from "./pages/SacredTexts";
import ScriptureReaderPage from "./pages/ScriptureReaderPage";
import UserSettings from "./pages/UserSettings";
import SplashScreen from "./components/auth/SplashScreen";
import DeitiesPage from "./pages/DeitiesPage";
import TemplesPage from "./pages/TemplesPage";
import PriestDirectoryPage from "./pages/PriestDirectoryPage";
import { AuthProvider } from "./hooks/use-auth";
import LegalPage from "./pages/LegalPage";
import { LocaleProvider } from "./hooks/use-locale";
import MyDharmaPage from "./pages/MyDharmaPage";
import CultureIndiaPage from "./pages/CultureIndiaPage";
import WisdomLivePage from "./pages/WisdomLivePage";
import VedicAstrologyPage from "./pages/VedicAstrologyPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LocaleProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/mantras" element={<MantrasPage />} />
              <Route path="/darshan" element={<LiveDarshan />} />
              <Route path="/pdf-reader" element={<SacredTexts />} />
              <Route path="/scriptures" element={<SacredTexts />} />
              <Route path="/scriptures/read/:id" element={<ScriptureReaderPage />} />
              <Route path="/deities" element={<DeitiesPage />} />
              <Route path="/deities/:slug" element={<DeitiesPage />} />
              <Route path="/temples" element={<TemplesPage />} />
              <Route path="/priests" element={<PriestDirectoryPage />} />
              <Route path="/settings" element={<UserSettings />} />
              <Route path="/my-dharma" element={<MyDharmaPage />} />
              <Route path="/culture" element={<CultureIndiaPage />} />
              <Route path="/culture/:id" element={<CultureIndiaPage />} />
              <Route path="/wisdom" element={<WisdomLivePage />} />
              <Route path="/astrology" element={<VedicAstrologyPage />} />
              <Route path="/login" element={<SplashScreen />} />
              <Route path="/legal/:type" element={<LegalPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LocaleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
