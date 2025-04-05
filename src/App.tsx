import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import EventCreationPage from "./pages/EventCreationPage";
import { Footer } from "./components/Footer";
import TicketPurchasePage from "./pages/TicketPurchasePage";
import TicketVerificationPage from "./pages/TicketVerificationPage";
import OrganizerDashboard from "./pages/OrganizerDashboard";
// import UserTicketsPage from "./pages/UserTicketPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-event" element={<EventCreationPage />} />
            <Route path="/event/:id" element={<TicketPurchasePage />} />
            <Route path="/verify" element={<TicketVerificationPage />} />
            <Route path="/dashboard" element={<OrganizerDashboard />} />
            {/* <Route path="/my-tickets" element={<UserTicketsPage />} /> */}
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
