import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SimpleToaster } from "@/components/SimpleToaster";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CoachAuthProvider } from "@/contexts/CoachAuthContext";
import ProtectedCoachRoute from "@/components/ProtectedCoachRoute";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import CoachLogin from "./pages/CoachLogin";
import ParentDashboard from "./pages/ParentDashboard";
import NotFound from "./pages/NotFound";
import AdminAnalytics from "./components/AdminAnalytics";

// Create QueryClient outside the component to avoid re-instantiation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Track online status for improved PWA offline UX
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Show a notification if the app is offline
  useEffect(() => {
    if (!isOnline) {
      console.log('App is offline. Using cached data.');
      // You could also show a toast notification here
    }
  }, [isOnline]);

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <CoachAuthProvider>
            <BrowserRouter>
              <SimpleToaster />
              <Toaster />
              
              {/* Offline Indicator */}
              {!isOnline && (
                <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center text-sm py-1 z-50">
                  You're offline. Using cached data.
                </div>
              )}
              
              {/* PWA Install Prompt */}
              <PWAInstallPrompt />
              
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/coach/login" element={<CoachLogin />} />
                <Route 
                  path="/coach/dashboard" 
                  element={
                    <ProtectedCoachRoute>
                      <CoachDashboard />
                    </ProtectedCoachRoute>
                  } 
                />
                <Route path="/parent/dashboard" element={<ParentDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CoachAuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
