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
  Download,
  ArrowUpRight,
  // ArrowDownRight,
  DollarSign,
  Filter,
  Clock,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
// import { getEvents, getTicketsByOwner } from "../lib/api";
import { getEvents } from "../lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

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
}

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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const navigate = useNavigate();

  // Fetch events from the API
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const eventsData: Event[] = await getEvents();
        setEvents(eventsData);

        // Calculate dashboard stats
        if (eventsData.length > 0) {
          // In a real app, you would fetch attendees for each event
          // For now, we'll use mock data
            type Attendee = {
              id: string;
              name: string;
              wallet: string;
              event: string;
              purchaseDate: string;
            };
            const mockAttendees: Attendee[] = [];
            interface Event {
            id: string;
            name: string;
            ticket_quantity: number;
            available_tickets: number;
            created_at: string;
            }

            interface MockAttendee {
            id: string;
            name: string;
            wallet: string;
            event: string;
            purchaseDate: string;
            }

            eventsData.forEach((event: Event) => {
            const soldTickets = event.ticket_quantity - event.available_tickets;
            for (let i = 0; i < Math.min(soldTickets, 5); i++) {
              mockAttendees.push({
              id: `${event.id}-${i}`,
              name: `Attendee ${i + 1}`,
              wallet: `0x${Math.random()
                .toString(16)
                .substring(2, 10)}...${Math.random()
                .toString(16)
                .substring(2, 6)}`,
              event: event.name,
              purchaseDate: new Date(event.created_at).toLocaleDateString(),
              } as MockAttendee);
            }
            });
          console.log(attendees);
          setAttendees(mockAttendees);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

    console.log(events);


  // Filter events based on search term
  const filteredEvents = events.filter((event: Event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter attendees based on search term
  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.wallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dashboard stats
  const totalRevenue = events
    .reduce((sum, event) => {
      const soldTickets = event.ticket_quantity - event.available_tickets;
      return sum + soldTickets * event.ticket_price;
    }, 0)
    .toFixed(2);

  const totalTicketsSold = events.reduce((sum, event) => {
    return sum + (event.ticket_quantity - event.available_tickets);
  }, 0);

  // View event details
  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

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
                <h3 className="text-2xl font-bold">{totalRevenue} ETH</h3>
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
                <h3 className="text-2xl font-bold">{attendees.length}</h3>
                <p className="text-xs text-emerald-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  Unique wallet addresses
                </p>
              </div>
              <div className="bg-emerald-500/20 p-3 rounded-full">
                <Users className="h-6 w-6 text-emerald-500" />
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
                              <DropdownMenuItem
                                onClick={() => handleViewEvent(event)}
                              >
                                View Event Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Event</DropdownMenuItem>
                              <DropdownMenuItem>
                                Export Attendees
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
                            {event.ticket_quantity -
                              event.available_tickets} / {event.ticket_quantity}{" "}
                            tickets sold
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Revenue:{" "}
                            </span>
                            <span className="font-medium text-emerald-500">
                              {(
                                (event.ticket_quantity -
                                  event.available_tickets) *
                                  (event.ticket_price)
                              ).toFixed(2)}{" "}
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

        <TabsContent value="attendees">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attendees</CardTitle>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-2 text-muted-foreground">
                    Loading attendees...
                  </p>
                </div>
              ) : filteredAttendees.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No attendees found matching your search.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Wallet Address</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Purchase Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAttendees.map((attendee) => (
                        <TableRow key={attendee.id}>
                          <TableCell className="font-medium">
                            {attendee.name}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {attendee.wallet}
                          </TableCell>
                          <TableCell>{attendee.event}</TableCell>
                          <TableCell>{attendee.purchaseDate}</TableCell>
                          <TableCell className="text-right">
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
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Verify Ticket
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  Revoke Ticket
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={
                    selectedEvent.image_url ||
                    "/placeholder.svg?height=300&width=600"
                  }
                  alt={selectedEvent.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold">{selectedEvent.name}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 text-muted-foreground text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(selectedEvent.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {selectedEvent.time}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Location</h3>
                <p className="text-muted-foreground">
                  {selectedEvent.location}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Ticket Price</h3>
                  <p className="font-bold text-emerald-500">
                    {selectedEvent.ticket_price} ETH
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Tickets Sold</h3>
                  <p>
                    {selectedEvent.ticket_quantity -
                      selectedEvent.available_tickets}{" "}
                    / {selectedEvent.ticket_quantity}
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Collection Address</h3>
                  <p className="font-mono text-xs truncate">
                    {selectedEvent.collection_address}
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Created</h3>
                  <p>
                    {new Date(selectedEvent.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  onClick={() => {
                    setShowEventDetails(false);
                    navigate(`/event/${selectedEvent.id}`);
                  }}
                >
                  View Event Page
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    window.open(
                      `https://goerli.etherscan.io/address/${selectedEvent.collection_address}`,
                      "_blank"
                    )
                  }
                >
                  View on Etherscan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
