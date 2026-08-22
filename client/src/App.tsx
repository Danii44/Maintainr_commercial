import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Track from "./pages/Track";
import StaffOrders from "./pages/StaffOrders";
import SiteHeader from "./components/SiteHeader";

function PlaceholderPage({ title, kicker }: { title: string; kicker: string }) {
  return <div className="site-shell"><SiteHeader /><main className="simple-page"><span className="eyebrow">{kicker}</span><h1>{title}</h1><p>This page is connected to the UAE storefront and ready for your final restaurant content.</p><a className="order-button" href="/">Back to home <span>↗</span></a></main></div>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/shop" component={Shop} /><Route path="/track" component={Track} /><Route path="/staff/orders" component={StaffOrders} /><Route path="/news"><PlaceholderPage title="Fresh from the kitchen." kicker="Foodking journal" /></Route><Route path="/contact"><PlaceholderPage title="Let’s talk food." kicker="Contact Foodking UAE" /></Route><Route><PlaceholderPage title="Page not found." kicker="404" /></Route></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
