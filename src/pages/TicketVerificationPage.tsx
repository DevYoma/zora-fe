// File: src/pages/TicketVerificationPage.jsx
import { useState, useRef, useEffect } from "react";
import { Camera, QrCode, CheckCircle, XCircle, Ticket, ArrowLeft } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Link } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { API_URL } from "../lib/api";

type TicketData = {
  id: string;
  owner_address: string;
  events: {
    name: string;
  };
  message?: string;
  usedAt?: string;
};

export default function TicketVerificationPage() {
  // @ts-ignore
  const [activeTab, setActiveTab] = useState("camera");
  // @ts-ignore
  const [isScanning, setIsScanning] = useState(false);
   const [verificationResult, setVerificationResult] = useState<"valid" | "invalid" | null>(null);
  const [ticketCode, setTicketCode] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerDivRef = useRef(null);
  const [errorType, setErrorType] = useState<"SERVER_ERROR" | "TICKET_ALREADY_USED" | "TICKET_NOT_FOUND" | null>(null);

  // const startScanner = () => {
  //   if (!scannerDivRef.current) return;
    
  //   try {
  //     setCameraError(null);
  //     setIsScanning(true);
      
  //     // Initialize the scanner
  //     scannerRef.current = new Html5QrcodeScanner(
  //       "qr-reader",
  //       { fps: 10, qrbox: 250 },
  //       false
  //     );
      
  //     // Define success callback
  //     const onScanSuccess = (decodedText: string) => {
  //       console.log(`QR Code scanned: ${decodedText}`);
  //       stopScanner();
        
  //       // Verify the scanned ticket
  //       verifyTicket(decodedText);
  //     };
      
  //     // Define error callback
  //     const onScanError = (error: string) => {
  //       // Don't log errors continuously - they happen frequently during normal scanning
  //       if (error !== "QR code parse error") {
  //         console.error(`QR scan error: ${error}`);
  //       }
  //     };
      
  //     // Start the scanner
  //     scannerRef.current.render(onScanSuccess, onScanError);
  //   } catch (error) {
  //     console.error("Error starting scanner:", error);
  //     setCameraError("Could not access camera. Please ensure you've granted camera permissions.");
  //     setIsScanning(false);
  //   }
  // };

  // const stopScanner = () => {
  //   if (scannerRef.current) {
  //     try {
  //       scannerRef.current.clear();
  //       scannerRef.current = null;
  //     } catch (error) {
  //       console.error("Error stopping scanner:", error);
  //     }
  //   }
  //   setIsScanning(false);
  // };

  const verifyTicket = async (code: string) => {
    setIsVerifying(true);
    // const parsedCode = parseInt(code)

    console.log("Sending verification request for code: ", code);

    try {
      // Send the raw code to the backend for verification
      const response = await fetch(`${API_URL}/tickets/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      console.log("Verification response:", data);

      if (data.valid) {
        setVerificationResult("valid");
        setTicketData(data.ticket);
        setErrorType(null);
      } else {
        setVerificationResult("invalid");
        setTicketData(data);
        setErrorType(data.errorType);
      }
    } catch (error) {
      console.error("Error verifying ticket:", error);
      setVerificationResult("invalid");
      setErrorType("SERVER_ERROR");
    } finally {
      setIsVerifying(false);  
    }
  };

  const verifyManualCode = () => {
    if (ticketCode.trim() === "") return;
    verifyTicket(ticketCode);
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setTicketCode("");
    setCameraError(null);
    setTicketData(null);
  };

  // Clean up scanner when component unmounts
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
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
                        <p className="font-medium">
                          {ticketData?.events.name || "Event Name"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Ticket ID
                        </p>
                        <p className="font-mono text-sm">
                          {ticketData?.id || "Ticket ID"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Owner</p>
                        <p className="font-mono text-sm truncate">
                          {ticketData?.owner_address || "Owner Address"}
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

                    {errorType === "TICKET_ALREADY_USED" ? (
                      <>
                        <h2 className="text-2xl font-bold text-destructive">
                          Ticket Already Used
                        </h2>
                        <p className="text-muted-foreground">
                          {ticketData?.message ||
                            "This ticket has already been scanned and used."}
                        </p>
                        {ticketData?.usedAt && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Used on:{" "}
                            {new Date(ticketData.usedAt).toLocaleString()}
                          </p>
                        )}
                      </>
                    ) : errorType === "TICKET_NOT_FOUND" ? (
                      <>
                        <h2 className="text-2xl font-bold text-destructive">
                          Ticket Not Found
                        </h2>
                        <p className="text-muted-foreground">
                          {ticketData?.message ||
                            "This ticket does not exist in our system."}
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-destructive">
                          Invalid Ticket
                        </h2>
                        <p className="text-muted-foreground">
                          {ticketData?.message || "This ticket is invalid."}
                        </p>
                      </>
                    )}
                  </>
                )}

                <div className="w-full pt-4 flex flex-col gap-2">
                  <Button
                    onClick={resetVerification}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    Verify Another Ticket
                  </Button>
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
                <div className="relative bg-muted/30 rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  {isScanning ? (
                    <div
                      id="qr-reader"
                      ref={scannerDivRef}
                      className="w-full"
                    ></div>
                  ) : (
                    <div className="text-center p-6 aspect-square flex flex-col items-center justify-center">
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
                </div>

                <Button
                  // onClick={isScanning ? stopScanner : startScanner}
                  onClick={() => alert("QR scanning is currently unavailable. Please use manual entry.")}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  // className="w-full bg-blue-500 hover:bg-blue-600"
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
                  disabled={!ticketCode.trim() || isVerifying}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {isVerifying ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Verifying...
                    </>
                  ) : (
                    "Verify Ticket"
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Enter the ticket ID, wallet address, or scan the QR code
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