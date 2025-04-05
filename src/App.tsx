import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import EventCreationPage from "./pages/EventCreationPage";
import { Footer } from "./components/Footer";
import TicketPurchasePage from "./pages/TicketPurchasePage";
import TicketVerificationPage from "./pages/TicketVerificationPage";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import UserTicketsPage from "./pages/UserTicketPage";

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    // Mock wallet connection for now
    // In a real app, you would use ethers.js or web3.js to connect to MetaMask
    setWalletConnected(true);
    setWalletAddress("0x1234...5678");
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar
            walletConnected={walletConnected}
            walletAddress={walletAddress}
            connectWallet={connectWallet}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-event" element={<EventCreationPage />} />
            <Route path="/event/:id" element={<TicketPurchasePage />} />
            <Route path="/verify" element={<TicketVerificationPage />} />
            <Route path="/dashboard" element={<OrganizerDashboard />} />
            <Route path="/my-tickets" element={<UserTicketsPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
