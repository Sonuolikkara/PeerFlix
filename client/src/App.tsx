import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomeNew from "@/pages/HomeNew";
import WatchNew from "@/pages/WatchNew";
import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeNew} />
      <Route path="/watch/:id" component={WatchNew} />
      {/* For demo, channel links redirect to home or 404 for now, can be added later */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
