// "use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

interface NavbarProps {
  walletConnected: boolean;
  walletAddress: string;
  connectWallet: () => void;
}

export default function Navbar({
  walletConnected,
  walletAddress,
  connectWallet,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              NFTickets
            </span>
          </Link>
          <div className="hidden md:flex md:gap-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/create-event"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Create Event
            </Link>
            <Link
              to="/verify"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Verify Ticket
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              to="/my-tickets"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              My Tickets
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {walletConnected ? (
            <Button variant="outline" className="hidden md:flex">
              <Wallet className="mr-2 h-4 w-4" />
              {walletAddress}
            </Button>
          ) : (
            <Button onClick={connectWallet} className="hidden md:flex">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="container md:hidden">
          <div className="flex flex-col space-y-3 pb-3">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/create-event"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Event
            </Link>
            <Link
              to="/verify"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Verify Ticket
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            {walletConnected ? (
              <Button variant="outline" size="sm" className="justify-start">
                <Wallet className="mr-2 h-4 w-4" />
                {walletAddress}
              </Button>
            ) : (
              <Button
                onClick={connectWallet}
                size="sm"
                className="justify-start"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
