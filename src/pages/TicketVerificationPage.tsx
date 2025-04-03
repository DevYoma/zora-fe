import { useState, useRef, useEffect } from "react";
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
import { Card, CardContent } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Link } from "react-router-dom";
// import { QrReader } from "@blackbox-vision/react-qr-reader"; 
// did npm i --force

export default function TicketVerificationPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState("camera"); 
  console.log("activeTab", activeTab);
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState<
    "valid" | "invalid" | null
  >(null);
  const [ticketCode, setTicketCode] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanning = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // In a real app, you would implement QR code scanning here
      // For demo purposes, we'll simulate a successful scan after 3 seconds
      setTimeout(() => {
        stopScanning();
        setVerificationResult("valid");
      }, 3000);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(
        "Could not access camera. Please ensure you've granted camera permissions."
      );
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
  };

  const verifyManualCode = () => {
    if (ticketCode.trim() === "") return;

    // In a real app, this would verify the ticket code against the blockchain
    // For demo purposes, we'll simulate verification based on input
    if (ticketCode.startsWith("0x") || ticketCode.length > 8) {
      setVerificationResult("valid");
    } else {
      setVerificationResult("invalid");
    }
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setTicketCode("");
    setCameraError(null);
  };

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  

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
                      <div>
                        <p className="text-xs text-muted-foreground">Event</p>
                        <p className="font-medium">Web3 Conference 2023</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Ticket ID
                        </p>
                        <p className="font-mono text-sm">
                          {ticketCode || "0x1a2b3c4d5e6f7a8b"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Owner</p>
                        <p className="font-mono text-sm truncate">
                          0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="font-medium text-emerald-500">
                          Valid - First Entry
                        </p>
                      </div>
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
                      This ticket is invalid or has already been used.
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
                  {isScanning ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Camera preview will appear here
                      </p>
                      {cameraError && (
                        <p className="mt-2 text-sm text-destructive">
                          {cameraError}
                        </p>
                      )}
                    </div>
                  )}

                  {isScanning && (
                    <div className="absolute inset-0 border-2 border-blue-500 z-10 flex items-center justify-center">
                      <div className="w-1/2 h-1/2 border-2 border-white/70 rounded-lg"></div>
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
