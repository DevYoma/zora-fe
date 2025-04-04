import { useState } from "react";
import { Calendar, Clock, MapPin, Upload, Ticket, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label"; 
import { useNavigate } from "react-router-dom";
// import { createZoraCollection } from "../lib/zora";
// import { uploadToIPFS } from "../lib/ipfs";

// api call import to createEvent in api.js
import { API_URL, createEvent } from "../lib/api";
// import { uploadEventImage } from "../service/uploadService";
// import { uploadEventImage } from "../service/uploadService.js";

export default function EventCreationPage() {
  const [eventData, setEventData] = useState<{
    name: string;
    date: string;
    time: string;
    location: string;
    description: string;
    ticketPrice: string;
    ticketQuantity: string;
    image: File | null;
    imagePreview: string | null;
  }>({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    ticketPrice: "",
    ticketQuantity: "",
    image: null,
    imagePreview: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadError, setUploadError] = useState<null | string>(null);
  const [error, setError] = useState(null);
  const [collectionAddress, setCollectionAddress] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // @ts-expect-error
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Update the upload function
  interface UploadResponse {
    url: string;
  }

  const uploadWithProgress = async (
    file: File,
    eventName: string
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("eventName", eventName);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event: ProgressEvent) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response: UploadResponse = JSON.parse(xhr.responseText);
          resolve(response.url);
        } else {
          reject(new Error("Upload failed"));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error"));
      });

      xhr.open("POST", `${API_URL}/upload/image`);
      xhr.send(formData);
    });
  };

  // After creating the Zora collection on the blockchain
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setUploadError(null);

    try {
      // 1. Upload image to IPFS (you'll need to implement this)
      let imageUrl = "";
      if (eventData.image) {
        // Upload to IPFS or your preferred storage
        try {
          // imageUrl = await uploadEventImage(eventData.image, eventData.name);
          imageUrl = await uploadWithProgress(eventData.image, eventData.name) as string;
          console.log("Image uploaded successfully:", imageUrl);
        } catch (error) {
          console.error("Image upload failed:", error);
          setUploadError("Failed to upload image. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Create Zora collection (mock for now)
      const collectionAddress = "0x1234567890123456789012345678901234567890"; // Replace with actual creation
      const transactionHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"; // Replace with actual tx

      // 3. Save event to your backend
      const eventRecord = {
        name: eventData.name,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        description: eventData.description,
        ticketPrice: eventData.ticketPrice,
        ticketQuantity: eventData.ticketQuantity,
        imageUrl: imageUrl,
        collectionAddress: collectionAddress,
        creatorAddress: "0x0987654321098765432109876543210987654321", // Replace with actual wallet address
        transactionHash: transactionHash,
      };

      const savedEvent = await createEvent(eventRecord);
      console.log("Event saved to database:", savedEvent);

      setCollectionAddress(collectionAddress);
      setIsSuccess(true);
    } catch (err) {
      console.error("Error creating event:", err);
      //@ts-expect-error
      setError(err.message || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-12">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Create Event
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below to create your event and mint NFT tickets.
          </p>
        </div>

        {isSuccess ? (
          <Card className="border-green-500">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold">
                  Event Created Successfully!
                </h2>
                <p className="text-muted-foreground">
                  Your event has been created and NFT tickets have been minted
                  on Zora.
                </p>

                {collectionAddress && (
                  <div className="w-full mt-4 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Collection Address:
                    </p>
                    <p className="font-mono text-xs break-all">
                      {collectionAddress}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 w-full mt-4">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate(`/dashboard`)}
                  >
                    Go to Dashboard
                  </Button>

                  {collectionAddress && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://goerli.etherscan.io/address/${collectionAddress}`,
                          "_blank"
                        )
                      }
                    >
                      View on Etherscan
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* ... existing form code */
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter event name"
                    value={eventData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        className="pl-10"
                        value={eventData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        className="pl-10"
                        value={eventData.time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      placeholder="Enter event location"
                      className="pl-10"
                      value={eventData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your event"
                    rows={4}
                    value={eventData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticketPrice">Ticket Price (ETH)</Label>
                    <div className="relative">
                      <Ticket className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="ticketPrice"
                        name="ticketPrice"
                        type="number"
                        step="0.001"
                        min="0"
                        placeholder="0.05"
                        className="pl-10"
                        value={eventData.ticketPrice}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticketQuantity">Number of Tickets</Label>
                    <Input
                      id="ticketQuantity"
                      name="ticketQuantity"
                      type="number"
                      min="1"
                      placeholder="100"
                      value={eventData.ticketQuantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Banner Image</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="image"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      {eventData.imagePreview ? (
                        <img
                          src={eventData.imagePreview || "/placeholder.svg"}
                          alt="Event preview"
                          className="w-full max-h-48 object-cover rounded-lg mb-4"
                        />
                      ) : (
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {eventData.imagePreview
                          ? "Change image"
                          : "Upload event banner image"}
                      </span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NFT Ticket Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/2 aspect-[3/4] bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 rounded-lg overflow-hidden shadow-lg">
                    <div className="h-full w-full bg-black/80 p-6 flex flex-col">
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white truncate">
                            {eventData.name || "Event Name"}
                          </h3>
                          <div className="mt-2 flex items-center text-white/70">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>{eventData.date || "Date"}</span>
                          </div>
                          <div className="mt-1 flex items-center text-white/70">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>{eventData.time || "Time"}</span>
                          </div>
                          <div className="mt-1 flex items-center text-white/70">
                            <MapPin className="mr-2 h-4 w-4" />
                            <span>{eventData.location || "Location"}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/20">
                          <div className="text-xs text-white/50">
                            TICKET PRICE
                          </div>
                          <div className="text-xl font-bold text-white">
                            {eventData.ticketPrice || "0.00"} ETH
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="text-center">
                          <div className="text-xs text-white/50 mb-2">
                            POWERED BY
                          </div>
                          <div className="text-white font-bold">ZORA NFT</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2">
                    <p className="text-muted-foreground mb-4">
                      This is a preview of how your NFT ticket will look. Each
                      ticket will be minted as a unique NFT on Zora.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                        <span>Unique NFT for each ticket</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                        <span>Verifiable on-chain ownership</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                        <span>Resellable on secondary markets</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                        <span>Includes QR code for event entry</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Creating Event..."
                    : "Create Event & Mint NFT Tickets"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
            {error}
          </div>
        )}
        {uploadError && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md">
            {uploadError}
          </div>
        )}
        {isSubmitting && eventData.image && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-xs text-muted-foreground mt-1">
              Uploading image: {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
