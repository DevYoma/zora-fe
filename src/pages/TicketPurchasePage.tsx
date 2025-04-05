import { useState, useEffect } from "react";

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {  
    ethereum?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request: (args: { method: string }) => Promise<any>;
    };
  }
}
// import { purchaseTickets } from "../lib/zora"; 
import { useParams, Link } from "react-router-dom";

// api imports
import { getEvent as fetchEvent } from "../lib/api";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  ArrowRight,
  Check,
  AlertCircle,
  QrCode,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Event } from "./OrganizerDashboard";
// @ts-ignore
import { connectWallet, getCurrentAccount, sendTransaction,} from "../service/walletService";
import { API_URL } from "../lib/api";

export declare function getEvent(id: string): Promise<{
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  ticket_price: string;
  available: number;
  total: number;
  image: string;
}>;

export declare function recordTicketPurchase(data: {
  eventId: string;
  tokenIds: number[];
  ownerAddress: string;
  purchaseTransactionHash: string;
}): Promise<void>;

type PurchasedData = {
  ticketId: string;
  transactionHash: string;
};

export default function TicketPurchasePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = useParams();
  // const [event, setEvent] = useState<typeof eventData>(); // set the type of event to the mock data type
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [walletAddress, setWalletAddress] = useState("");
  // const [transactionHash, setTransactionHash] = useState("");
  // const [purchasedTokenIds, setPurchasedTokenIds] = useState<number[]>([]);
  const [purchasedData, setPurchasedData] = useState<PurchasedData | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, you would fetch the event data based on the ID
  // const event = eventData;
  // Fetch event data
  useEffect(() => {
    async function loadEvent() {
      try {
        const eventData = await fetchEvent(id);
        console.log(eventData)
        setEvent(eventData);

        // check if wallet is connected
        const account = await getCurrentAccount();
        if (account) {
          setWalletAddress(account);
        }
      } catch (err) {
        console.error("Error loading event:", err);
        setError("Failed to load event details");
      }finally{
        setIsLoading(false)
      }
    }

    if (id) {
      loadEvent();
    }
  }, [id]);

  const handleConnectWallet = async () => {
    try {
      const account = await connectWallet();
      setWalletAddress(account);
      setError(null);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  const handlePurchase = async () => {
    if (!event || !walletAddress) {
      if (!walletAddress) {
        setError("Please connect your wallet first");
      }
      return;
    }

    setIsPurchasing(true);
    setError(null);

    try {
      console.log("Starting ticket purchase process");

      // 1. Simulate sending an ETH transaction to the event creator
      const transaction = await sendTransaction(
        event.creator_address,
        event.ticket_price * quantity // Multiply price by quantity
      );

      console.log("Transaction sent:", transaction);

      // 2. Record the purchase in your backend
      const ticketResponse = await fetch(`${API_URL}/tickets/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: id,
          ownerAddress: walletAddress,
          purchase_transaction_hash: transaction.transactionHash,
          tokenId: Math.floor(Math.random() * 1000000), // Generate a random token ID
          quantity, // Include the quantity of tickets purchased
        }),
      });

      if (!ticketResponse.ok) {
        const errorData = await ticketResponse.json();
        throw new Error(errorData.error || "Failed to record ticket purchase");
      }

      const ticketData = await ticketResponse.json();
      console.log("Ticket purchase recorded:", ticketData);

      // 3. Update the event state with the new ticket stats
      setEvent((prevEvent) => {
        if (!prevEvent) return prevEvent; // If no event, return as is
        return {
          ...prevEvent,
          available_tickets: ticketData.available_tickets,
          ticketsSold: ticketData.ticketsSold,
        };
      });

      // 4. Update the purchased data state
      setPurchasedData({
        ticketId: ticketData.ticketId,
        transactionHash: transaction.transactionHash,
      });

      setIsPurchased(true);
    } catch (err) {
      console.error("Error purchasing tickets:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to purchase tickets. Please try again."
      );
    } finally {
      setIsPurchasing(false);
    }
  };  


  // const totalPrice = (Number.parseFloat(event?.ticket_price) * quantity).toFixed(3);
  const totalPrice = event ? ((event.ticket_price) * quantity).toFixed(3) : "0.000";
  console.log(totalPrice)

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="container py-12">
        <div className="bg-destructive/10 border border-destructive text-destructive p-6 rounded-md">
          <h2 className="text-xl font-bold">Error</h2>
          <p>{error}</p>
          <Link to="/">
            <Button className="mt-4">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-xl font-bold">Event Not Found</h2>
          <Link to="/">
            <Button className="mt-4">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
            <img
              src={event.image_url || "/placeholder.svg"}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{event.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {event.date}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {event.time}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {event.location}
              </div>
            </div>
            <div className="flex items-center mt-2 text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              Organized by {event.creator_address.substring(0, 6)}...
              {event.creator_address.substring(38)}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {event.description}
              </p>
            </CardContent>
          </Card>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Ticket Purchase */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle>Purchase Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Ticket className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="text-muted-foreground">Available:</span>
                  </div>
                  <span className="font-medium">
                    {/* {event.available_tickets} of {event.ticket_quantity} */}
                    {event ? event.available_tickets - quantity : 0} of{" "}
                    {event?.ticket_quantity}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Price per ticket:
                  </span>
                  <span className="font-bold text-lg text-blue-500">
                    {event.ticket_price} ETH
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Quantity:</span>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isPurchased || isPurchasing}
                    >
                      -
                    </Button>
                    <span className="mx-3 font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setQuantity(
                          Math.min(event.available_tickets, quantity + 1)
                        )
                      }
                      disabled={
                        quantity >= event.available_tickets ||
                        isPurchased ||
                        isPurchasing
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg text-blue-500">
                      {totalPrice} ETH
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Plus gas fees for the transaction
                  </div>
                </div>

                {isPurchased ? (
                  <div className="space-y-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                      <Check className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
                      <p className="font-medium text-emerald-500">
                        Purchase Successful!
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your ticket has been purchased successfully.
                      </p>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-purple-500 hover:bg-purple-600">
                          View My Ticket
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Your Ticket</DialogTitle>
                          <DialogDescription>
                            Present this QR code at the event entrance
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center p-4">
                          <div className="w-full aspect-[3/4] bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 rounded-lg overflow-hidden shadow-lg mb-4">
                            <div className="h-full w-full bg-black/80 p-6 flex flex-col">
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <h3 className="text-xl font-bold text-white truncate">
                                    {event.name}
                                  </h3>
                                  <div className="mt-2 flex items-center text-white/70">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>{event.date}</span>
                                  </div>
                                  <div className="mt-1 flex items-center text-white/70">
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>{event.time}</span>
                                  </div>
                                  <div className="mt-1 flex items-center text-white/70">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>

                                <div className="mt-4 bg-white/10 rounded-lg p-4 flex items-center justify-center">
                                  <div className="w-32 h-32 bg-white flex items-center justify-center">
                                    <QrCode
                                      values={JSON.stringify({
                                        ticketId: purchasedData?.ticketId,
                                        eventId: id,
                                        buyerAddress: walletAddress,
                                      })}
                                      size={120}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 pt-4 border-t border-white/20">
                                <div className="text-center">
                                  <div className="text-xs text-white/50 mb-2">
                                    TICKET OWNER
                                  </div>
                                  <div className="text-white font-mono text-xs truncate">
                                    {walletAddress}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full space-y-2">
                            <Button className="w-full" variant="outline">
                              Download Ticket
                            </Button>
                            <Link to="/verify">
                              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                                Go to Verification Page
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        window.open(
                          `https://etherscan.io/tx/${purchasedData?.transactionHash}`,
                          "_blank"
                        )
                      }
                    >
                      View on Etherscan
                    </Button>
                  </div>
                ) : (
                  <>
                    {!walletAddress && (
                      <Button
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        onClick={handleConnectWallet}
                      >
                        Connect Wallet
                      </Button>
                    )}

                    {walletAddress && (
                      <Button
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        onClick={handlePurchase}
                        disabled={isPurchasing || event.available_tickets <= 0}
                      >
                        {isPurchasing ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            Purchasing...
                          </>
                        ) : event.available_tickets <= 0 ? (
                          "Sold Out"
                        ) : (
                          <>
                            Buy Tickets <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}

                <div className="text-xs text-muted-foreground">
                  By purchasing tickets, you agree to our Terms of Service and
                  Privacy Policy.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
