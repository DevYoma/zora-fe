// src/lib/qrcode.ts
import QRCode from "qrcode";

interface TicketData {
  collectionAddress: string;
  tokenId: string;
  owner: string;
  eventId: string;
}

export async function generateTicketQR(ticketData: TicketData): Promise<string> {
  const data = JSON.stringify({
    collectionAddress: ticketData.collectionAddress,
    tokenId: ticketData.tokenId,
    owner: ticketData.owner,
    eventId: ticketData.eventId,
  });

  try {
    const qrDataUrl = await QRCode.toDataURL(data);
    return qrDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}
