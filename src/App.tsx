import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { usePreferences } from "@/hooks/usePreferences";

// Pages
import Home from "./pages/Home";
import QuickCalm from "./pages/QuickCalm";
import Breathing from "./pages/Breathing";
import WriteRelease from "./pages/WriteRelease";
import CheckIn from "./pages/CheckIn";
import SOS from "./pages/SOS";
import Grounding from "./pages/Grounding";
import Library from "./pages/Library";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { preferences } = usePreferences();

  // Apply dark mode based on preference
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quick-calm" element={<QuickCalm />} />
        <Route path="/breathing" element={<Breathing />} />
        <Route path="/write" element={<WriteRelease />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/grounding" element={<Grounding />} />
        <Route path="/library" element={<Library />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
