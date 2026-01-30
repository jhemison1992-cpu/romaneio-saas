import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PlanSelection from "./pages/PlanSelection";
import PricingPage from "./pages/PricingPage";
import CompanySetup from "./pages/CompanySetup";
import Dashboard from "./pages/Dashboard";
import RomaneioForm from "./pages/RomaneioForm";
import RomaneioDetail from "./pages/RomaneioDetail";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/pricing"} component={PricingPage} />
      <Route path={"/plans"} component={PlanSelection} />
      <Route path={"/setup"} component={CompanySetup} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/romaneio/new"} component={RomaneioForm} />
      <Route path={"/romaneio/:id"} component={RomaneioDetail} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
