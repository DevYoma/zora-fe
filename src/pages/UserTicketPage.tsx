// File: src/pages/UserTicketsPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ExternalLink,
  QrCode,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
} from "../components/ui/card";
// @ts-ignore
import { getCurrentAccount, connectWallet } from "../service/walletService";
// import QRCode from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { API_URL } from "../lib/api";

export default function UserTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        // Check if wallet is connected
        const account = await getCurrentAccount();
        if (account) {
          setWalletAddress(account);
          fetchTickets(account);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing:", error);
        if (error instanceof Error) {
          if (error instanceof Error) {
            if (error instanceof Error) {
              setError(error instanceof Error ? error.message : String(error));
            } else {
              setError(String(error));
            }
          } else {
            setError(String(error));
          }
        } else {
          setError(String(error));
        }
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const handleConnectWallet = async () => {
    try {
      const account = await connectWallet();
      setWalletAddress(account);
      fetchTickets(account);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const fetchTickets = async (address: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/tickets/user/${address}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }
      const data = await response.json();
      setTickets(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">My Tickets</h1>
          <p className="text-muted-foreground">
            Connect your wallet to view your tickets
          </p>
          <Button
            onClick={handleConnectWallet}
            className="mt-4 bg-blue-500 hover:bg-blue-600"
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Tickets</h1>
            <p className="text-muted-foreground">
              View and manage your event tickets
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-md">
            <span className="text-muted-foreground">Wallet:</span>
            <span className="font-mono">
              {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
            <h3 className="font-medium">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <Ticket className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-medium">No Tickets Found</h2>
            <p className="text-muted-foreground">
              You don't have any tickets yet.
            </p>
            <Link to="/">
              <Button className="mt-2 bg-blue-500 hover:bg-blue-600">
                Browse Events
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 p-6 flex flex-col justify-between text-white">
                    <div>
                      <h3 className="text-xl font-bold truncate">
                        {ticket.events.name}
                      </h3>
                      <div className="mt-2 flex items-center text-white/70">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{ticket.events.date}</span>
                      </div>
                      <div className="mt-1 flex items-center text-white/70">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{ticket.events.time}</span>
                      </div>
                      <div className="mt-1 flex items-center text-white/70">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{ticket.events.location}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="text-xs text-white/50">TICKET ID</div>
                      <div className="font-mono text-sm">{ticket.id}</div>
                    </div>
                  </div>

                  <div className="md:w-2/3 p-6">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Purchase Date
                            </div>
                            <div>
                              {new Date(
                                ticket.purchase_date
                              ).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Price
                            </div>
                            <div className="font-medium text-emerald-500">
                              {ticket.price} ETH
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="text-xs text-muted-foreground">
                            Status
                          </div>
                          <div
                            className={`font-medium ${
                              ticket.is_used
                                ? "text-muted-foreground"
                                : "text-emerald-500"
                            }`}
                          >
                            {ticket.is_used ? "Used" : "Valid"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1">
                              <QrCode className="mr-2 h-4 w-4" />
                              Show QR Code
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ticket QR Code</DialogTitle>
                              <DialogDescription>
                                Present this QR code at the event entrance
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center p-4">
                              <div className="bg-white p-4 rounded-lg">
                                <QrCode
                                  values={JSON.stringify({
                                    ticketId: ticket.id,
                                    eventId: ticket.event_id,
                                    buyerAddress: ticket.buyer_address,
                                  })}
                                  size={200}
                                //   level="H"
                                />
                              </div>
                              <div className="mt-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                  Ticket ID: {ticket.id}
                                </p>
                                <p className="text-sm font-medium mt-2">
                                  {ticket.events.name}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            window.open(
                              `https://etherscan.io/tx/${ticket.transaction_hash}`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Transaction
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
