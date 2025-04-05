import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import nft3 from "../assets/nft3.jpg"
import nft4 from "../assets/nft4.jpg";
import nft5 from "../assets/nft5.jpg"
import nft6 from "../assets/nft6.jpg"

// Mock data for featured events
const featuredEvents = [
  {
    id: "1",
    name: "Web3 Conference 2023",
    date: "Dec 15, 2023",
    location: "San Francisco, CA",
    price: "0.05 ETH",
    available: 120,
    image: nft3
  },
  {
    id: "2",
    name: "NFT Art Exhibition",
    date: "Jan 10, 2024",
    location: "New York, NY",
    price: "0.03 ETH",
    available: 75,
    image: nft4
  },
  {
    id: "3",
    name: "Blockchain Hackathon",
    date: "Feb 5, 2024",
    location: "Austin, TX",
    price: "0.02 ETH",
    available: 200,
    image: nft5
  },
  {
    id: "4",
    name: "DeFi Summit",
    date: "Mar 20, 2024",
    location: "Miami, FL",
    price: "0.08 ETH",
    available: 50,
    image: nft6
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-background via-background to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Own Your Ticket.{" "}
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">
                  Experience True Ownership.
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Decentralized event ticketing powered by Zora. Create, sell, and
                verify NFT tickets with true ownership and provenance.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/create-event">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Create Event
                </Button>
              </Link>
              <Link to="/#events">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500 text-purple-500 hover:bg-purple-500/10"
                >
                  Buy Tickets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section
        id="events"
        className="w-full py-12 md:py-24 lg:py-32 bg-background"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Past Events
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore events that have already taken place. Relive the
                memories and experiences.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {featuredEvents.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/50 backdrop-blur-sm bg-card/80"
              >
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle className="line-clamp-1">{event.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 opacity-70" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 opacity-70" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Ticket className="mr-2 h-4 w-4 opacity-70" />
                      <span>{event.available} tickets were available</span>
                    </div>
                    <div className="mt-2 font-bold text-emerald-500">
                      {event.price}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                How It Works
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Simple, secure, and transparent event ticketing on the
                blockchain.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Create Event</h3>
              <p className="text-muted-foreground">
                Create your event with all details and mint NFT tickets directly
                on Zora.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 text-purple-500">
                <Ticket className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Buy Tickets</h3>
              <p className="text-muted-foreground">
                Purchase tickets as NFTs with your crypto wallet. Each ticket is
                unique and verifiable.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                <ArrowRight className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Attend Event</h3>
              <p className="text-muted-foreground">
                Show your NFT ticket for verification at the event using our QR
                code scanner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t border-border">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join the future of event ticketing with blockchain technology.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/create-event">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Create Your First Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
