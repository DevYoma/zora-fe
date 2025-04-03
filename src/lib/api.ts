/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
// const API_URL = "http://localhost:3001/api";
const API_URL = "https://zora-be.onrender.com/api";

// Event API calls
export async function getEvents() {
  const response = await fetch(`${API_URL}/events`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch events");
  }

  return response.json();
}

export async function getEvent(id) {
  const response = await fetch(`${API_URL}/events/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch event");
  }

  return response.json();
}

export async function createEvent(eventData) {
  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create event");
  }

  return response.json();
}

// Ticket API calls
export async function recordTicketPurchase(purchaseData) {
  const response = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(purchaseData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to record ticket purchase");
  }

  return response.json();
}

export async function verifyTicket(ticketId) {
  const response = await fetch(`${API_URL}/tickets/${ticketId}/verify`, {
    method: "PUT",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to verify ticket");
  }

  return response.json();
}

export async function getTicketsByOwner(address) {
  const response = await fetch(`${API_URL}/tickets/owner/${address}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch tickets");
  }

  return response.json();
}
