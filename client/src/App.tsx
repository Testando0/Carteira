import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

export default function App(){
  return <ThemeProvider><ErrorBoundary><Toaster /><Home /></ErrorBoundary></ThemeProvider>;
}
