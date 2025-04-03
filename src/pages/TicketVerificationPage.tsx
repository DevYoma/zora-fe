import { useState, useEffect, useRef } from "react";
import {
  Camera,
  QrCode,
  CheckCircle,
  XCircle,
  Ticket,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  // CardHeader,
  // CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Link } from "react-router-dom";
import { verifyTicket } from "../lib/api";
import { Html5Qrcode } from "html5-qrcode";

type TicketData = {
  id: string;
  owner_address: string;
  events: {
    name: string;
  };
};

export default function TicketVerificationPage() {
  const [activeTab, setActiveTab] = useState("camera");
  console.log(activeTab)
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState<
    "valid" | "invalid" | null
  >(null);
  const [ticketCode, setTicketCode] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null); // this needs to be typed and gotten from the API
  const [error, setError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "qr-reader";

  // Clean up scanner when component unmounts
  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch((error) => {
          console.error("Error stopping scanner:", error);
        });
      }
    };
  }, [isScanning]);

  const startScanning = async () => {
    try {
      setCameraError(null);
      setError(null);

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }

      const qrCodeSuccessCallback = async (decodedText: string) => {
        try {
          console.log("QR Code detected:", decodedText);

          // Stop scanning
          await stopScanning();

          // Try to parse the QR code data
          let ticketId;
          try {
            // First try to parse as JSON
            const parsedData = JSON.parse(decodedText);
            ticketId = parsedData.id || parsedData.ticketId;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            // If not JSON, use the raw text as ticket ID
            ticketId = decodedText;
          }

          if (!ticketId) {
            throw new Error("Invalid QR code format. No ticket ID found.");
          }

          // Verify the ticket using the API
          const verification = await verifyTicket(ticketId);

          setTicketData(verification.ticket);
          setVerificationResult("valid");
        } catch (err) {
          console.error("Error processing QR code:", err);
          setVerificationResult("invalid");
          if (err instanceof Error) {
            setError(err instanceof Error ? err.message : "Failed to verify ticket");
          } else {
            setError("Failed to verify ticket");
          }
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qrCodeErrorCallback = (error: any) => {
        console.error("QR Code scanning error:", error);
        setCameraError(error.toString());
      };

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      );

      setIsScanning(true);
    } catch (error) {
      console.error("Error starting scanner:", error);
      setCameraError(
        "Could not access camera. Please ensure you've granted camera permissions."
      );
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };

  const verifyManualCode = async () => {
    if (!ticketCode.trim()) return;

    try {
      setError(null);

      // Verify the ticket using the API
      const verification = await verifyTicket(ticketCode);

      setTicketData(verification.ticket);
      setVerificationResult("valid");
    } catch (err) {
      console.error("Error verifying ticket:", err);
      setVerificationResult("invalid");
      setError(err instanceof Error ? err.message : "Failed to verify ticket");
    }
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setTicketCode("");
    setCameraError(null);
    setError(null);
    setTicketData(null);
  };

  return (
    <div className="container max-w-md py-12">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Ticket Verification</h1>
          <p className="text-muted-foreground">
            Scan QR codes or enter ticket details to verify attendees
          </p>
        </div>

        {verificationResult ? (
          <Card
            className={
              verificationResult === "valid"
                ? "border-emerald-500/50"
                : "border-destructive/50"
            }
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                {verificationResult === "valid" ? (
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-500">
                      Ticket Verified!
                    </h2>

                    <div className="w-full bg-muted/30 rounded-lg p-4 text-left space-y-3">
                      {ticketData && (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Event
                            </p>
                            <p className="font-medium">
                              {ticketData.events?.name || "Event Name"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Ticket ID
                            </p>
                            <p className="font-mono text-sm">
                              {ticketData.id || ticketCode}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Owner
                            </p>
                            <p className="font-mono text-sm truncate">
                              {ticketData.owner_address || "Owner Address"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Status
                            </p>
                            <p className="font-medium text-emerald-500">
                              Valid - First Entry
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                      <XCircle className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-destructive">
                      Invalid Ticket
                    </h2>
                    <p className="text-muted-foreground">
                      {error ||
                        "This ticket is invalid or has already been used."}
                    </p>
                  </>
                )}

                <div className="w-full pt-4 flex flex-col gap-2">
                  <Button
                    onClick={resetVerification}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    Verify Another Ticket
                  </Button>

                  {verificationResult === "valid" && (
                    <Button
                      variant="outline"
                      className="w-full border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10"
                    >
                      Mark as Used
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Tabs defaultValue="camera" onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="camera" className="flex items-center">
                  <Camera className="mr-2 h-4 w-4" />
                  Scan QR
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center">
                  <QrCode className="mr-2 h-4 w-4" />
                  Manual Entry
                </TabsTrigger>
              </TabsList>

              <TabsContent value="camera" className="p-6 space-y-4">
                <div className="relative bg-muted/30 rounded-lg aspect-square overflow-hidden flex flex-col items-center justify-center">
                  <div id={scannerContainerId} className="w-full h-full">
                    {!isScanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 p-6">
                        <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-center">
                          Camera preview will appear here
                        </p>
                        {cameraError && (
                          <p className="mt-2 text-sm text-destructive text-center">
                            {cameraError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/70 rounded-lg"></div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={isScanning ? stopScanning : startScanning}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {isScanning ? "Cancel Scanning" : "Start Scanning"}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Position the QR code within the frame to scan
                </div>
              </TabsContent>

              <TabsContent value="manual" className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ticket-code">
                    Ticket ID or Wallet Address
                  </Label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="ticket-code"
                      placeholder="Enter ticket ID or wallet address"
                      value={ticketCode}
                      onChange={(e) => setTicketCode(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  onClick={verifyManualCode}
                  disabled={!ticketCode.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Verify Ticket
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Enter the ticket ID, NFT token ID, or wallet address
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        )}

        <div className="text-center">
          <Link to="/">
            <Button variant="link" className="text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
