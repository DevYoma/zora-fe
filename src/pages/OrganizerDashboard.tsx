import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Search,
  Plus,
  MoreHorizontal,
  Users,
  Ticket,
  BarChart3,
  ArrowUpRight,
  DollarSign,
  Filter,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { API_URL } from "../lib/api";

export type Event = {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
  ticket_price: number;
  ticket_quantity: number;
  available_tickets: number;
  collection_address: string;
  creator_address: string;
  transaction_hash: string;
  created_at: string;
  updated_at: string;
  ticketsSold: number;
  uniqueAttendees: number;
};

type Attendee = {
  id: string;
  name: string;
  wallet: string;
  event: string;
  purchaseDate: string;
};

export default function OrganizerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRevenueNumber, setTotalRevenueNumber] = useState(0);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const navigate = useNavigate();

  // Fetch events from the API
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/tickets/events`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const eventsData = await response.json();
        setEvents(eventsData);

        // Calculate dashboard stats
        const totalRevenue = eventsData.reduce((sum: number, event: Event): number => {
          const ticketPriceInEth: number = event.ticket_price / 1e18; // Convert ticket price from Wei to ETH
          return sum + event.ticketsSold * ticketPriceInEth;
        }, 0);

        const totalTicketsSold = eventsData.reduce((sum: number, event: Event): number => {
          return sum + event.ticketsSold;
        }, 0);

        setTotalRevenueNumber(totalRevenue.toFixed(2));
        setTotalTicketsSold(totalTicketsSold);

        // Extract attendees data
        interface AttendeeData extends Attendee {
          wallet: string;
          purchaseDate: string;
        }

        const attendeesData: AttendeeData[] = eventsData.map((event: Event) => ({
          id: event.id,
          name: event.name,
          wallet: "N/A", // Replace with actual wallet data if available
          event: event.name,
          purchaseDate: new Date(event.created_at).toISOString(), // Replace with actual purchase date if available
        }));
        setAttendees(attendeesData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);
  console.log(attendees)

  // Filter events based on search term
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your events and track ticket sales
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events or attendees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Link to="/create-event">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">{totalRevenueNumber} ETH</h3>
                <p className="text-xs text-emerald-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  Updated just now
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground">Tickets Sold</p>
                <h3 className="text-2xl font-bold">{totalTicketsSold}</h3>
                <p className="text-xs text-emerald-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  From {events.length} events
                </p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-full">
                <Ticket className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground">Total Attendees</p>
                <h3 className="text-2xl font-bold">
                  {events.reduce(
                    (sum, event) => sum + event.uniqueAttendees,
                    0
                  )}
                </h3>
                <p className="text-xs text-emerald-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  Across {events.length} events
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="events" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="events" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            My Events
          </TabsTrigger>
          <TabsTrigger value="attendees" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Attendees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Events</CardTitle>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-2 text-muted-foreground">
                    Loading events...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  <p>{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No events found matching your search."
                      : "You haven't created any events yet."}
                  </p>
                  {!searchTerm && (
                    <Link to="/create-event">
                      <Button className="mt-4 bg-blue-500 hover:bg-blue-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Event
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg"
                    >
                      <div className="relative h-24 md:w-40 w-full rounded-lg overflow-hidden">
                        <img
                          src={
                            event.image_url ||
                            "/placeholder.svg?height=200&width=400"
                          }
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold">{event.name}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => navigate(`/event/${event.id}`)}
                              >
                                View Event Page
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                View Event Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Cancel Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 text-muted-foreground text-sm">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            {event.ticketsSold} / {event.ticket_quantity}{" "}
                            tickets sold
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Revenue:{" "}
                            </span>
                            <span className="font-medium text-emerald-500">
                              {(event.ticketsSold * event.ticket_price).toFixed(
                                2
                              )}{" "}
                              ETH
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8">
                              <Users className="mr-2 h-4 w-4" />
                              Attendees
                            </Button>
                            <Button
                              size="sm"
                              className="h-8 bg-blue-500 hover:bg-blue-600"
                            >
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Analytics
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
