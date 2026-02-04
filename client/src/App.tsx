import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Reservations from "@/pages/Reservations";
import OurPlace from "@/pages/OurPlace";
import AboutUs from "@/pages/AboutUs";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/reservations" component={Reservations} />
      <Route path="/our-place" component={OurPlace} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/contact" component={AboutUs} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#222222] flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Router />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
