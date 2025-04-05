# 🎨 Zora Frontend — NFT-based Event Ticketing UI

This is the frontend of **Zora**, a Web3-enabled event ticketing app where users can create events, purchase tickets, and verify ownership — all with a sleek, modern interface powered by Tailwind and React.

---

## 🧪 Pages Overview

### 🏠 Home Page
Introductory page explaining the purpose of the platform.

### ➕ Create Event
Organizers can:
- Set event name
- Set ticket price
- Set ticket quantity

### ✅ Verify Ticket
Manually input or scan a Ticket ID to check ticket authenticity.

### 📈 Organizer Dashboard
Get live metrics:
- Revenue (in progress)
- Tickets sold
- Total attendees
- Event list with view buttons

### 📄 Event Detail Page
Buy tickets:
- Shows ticket availability
- Dynamic price based on quantity
- Auto-calculated total price

---

## 🧰 Tech Stack

- **React** (with TypeScript)
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **Context API** for state management
- **Fetch API** for backend communication

---

## 🚀 Getting Started

```bash
git clone https://github.com/DevYoma/zora-fe.git
cd zora-fe
npm install
npm run dev
