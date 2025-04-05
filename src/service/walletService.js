import { API_URL } from "../lib/api";

// File: src/services/walletService.js (ethers.js with simulation)
import { ethers } from "ethers";

let currentAccount = null;
let provider = null;

// Simulation mode flag
const SIMULATION_MODE = true; // Set to false to use real transactions

/**
 * Initialize ethers provider
 */
const initProvider = () => {
  if (!provider && window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  }
  return provider;
};

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== "undefined" && window.ethereum !== undefined;
};

/**
 * Connect to MetaMask wallet
 */
export const connectWallet = async () => {
  if (SIMULATION_MODE) {
    // In simulation mode, use a fake wallet address if MetaMask is not available
    if (!isMetaMaskInstalled()) {
      currentAccount = "0x" + "1".repeat(40); // Fake address
      console.log("SIMULATION: Connected to fake wallet:", currentAccount);
      return currentAccount;
    }
  } else if (!isMetaMaskInstalled()) {
    throw new Error(
      "MetaMask is not installed. Please install MetaMask to continue."
    );
  }

  try {
    // Initialize provider
    initProvider();

    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    currentAccount = accounts[0];

    // Set up event listeners for account changes
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return currentAccount;
  } catch (error) {
    if (SIMULATION_MODE) {
      // In simulation mode, use a fake wallet address if connection fails
      currentAccount = "0x" + "1".repeat(40); // Fake address
      console.log(
        "SIMULATION: Connected to fake wallet after error:",
        currentAccount
      );
      return currentAccount;
    }
    console.error("Error connecting to wallet:", error);
    throw error;
  }
};

/**
 * Handle account changes
 */
const handleAccountsChanged = (accounts) => {
  if (accounts.length === 0) {
    // User disconnected their wallet
    currentAccount = null;
    // Trigger any UI updates or callbacks here
    window.dispatchEvent(new CustomEvent("walletDisconnected"));
  } else if (accounts[0] !== currentAccount) {
    // Account changed
    currentAccount = accounts[0];
    // Trigger any UI updates or callbacks here
    window.dispatchEvent(
      new CustomEvent("walletChanged", { detail: currentAccount })
    );
  }
};

/**
 * Get current connected account
 */
export const getCurrentAccount = async () => {
  if (currentAccount) return currentAccount;

  if (SIMULATION_MODE && !isMetaMaskInstalled()) {
    // In simulation mode, use a fake wallet address if MetaMask is not available
    currentAccount = "0x" + "1".repeat(40); // Fake address
    console.log(
      "SIMULATION: Using fake wallet for getCurrentAccount:",
      currentAccount
    );
    return currentAccount;
  }

  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    currentAccount = accounts.length > 0 ? accounts[0] : null;
    return currentAccount;
  } catch (error) {
    console.error("Error getting current account:", error);
    return null;
  }
};

/**
 * Simulate or send an ETH transaction using ethers.js
 */
export const sendTransaction = async (toAddress, amount) => {
  if (SIMULATION_MODE) {
    // SIMULATION MODE: Don't actually send a transaction
    console.log("SIMULATION: Would send", amount, "ETH to", toAddress);

    // Generate a fake transaction hash
    const fakeHash =
      "0x" +
      Array(64)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");

    // Simulate a delay to mimic blockchain confirmation time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("SIMULATION: Transaction successful with hash:", fakeHash);

    // Return simulated transaction data
    return {
      transactionHash: fakeHash,
      from: currentAccount || "0x" + "1".repeat(40),
      to: toAddress,
      value: amount,
      simulated: true,
      explorerUrl: `https://goerli.etherscan.io/tx/${fakeHash}`, // Fake URL
    };
  }

  // REAL TRANSACTION MODE
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  if (!currentAccount) {
    await connectWallet();
  }

  try {
    // Make sure provider is initialized
    const ethersProvider = initProvider();
    if (!ethersProvider) {
      throw new Error("Failed to initialize ethers provider");
    }

    console.log("Ethers provider initialized");
    console.log("Sending transaction to:", toAddress);
    console.log("Amount:", amount, "ETH");

    // Get signer
    const signer = ethersProvider.getSigner();

    // Convert amount to wei
    const amountInWei = ethers.utils.parseEther(amount.toString());
    console.log("Amount in wei:", amountInWei.toString());

    // Create transaction request
    const tx = await signer.sendTransaction({
      to: toAddress,
      value: amountInWei,
      // Gas limit is automatically estimated by ethers
    });

    console.log("Transaction sent:", tx.hash);

    return {
      transactionHash: tx.hash,
      from: currentAccount,
      to: toAddress,
      value: amount,
      simulated: false,
    };
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
};

/**
 * Record ticket purchase in your backend
 * This function works with both real and simulated transactions
 */
export const recordTicketPurchase = async (
  eventId,
  walletAddress,
  transactionHash,
  price
) => {
  try {
    console.log("Recording ticket purchase:", {
      eventId,
      walletAddress,
      transactionHash,
      price,
    });

    // Call your backend API to record the purchase
    const response = await fetch(`${API_URL}/tickets/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        buyerAddress: walletAddress,
        transactionHash,
        price,
        // Add a flag to indicate this is a simulated transaction if needed
        // simulated: SIMULATION_MODE,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to record ticket purchase");
    }

    const data = await response.json();
    console.log("Ticket purchase recorded:", data);

    return data;
  } catch (error) {
    console.error("Error recording ticket purchase:", error);

    if (SIMULATION_MODE) {
      // In simulation mode, return fake success data even if the API call fails
      console.log("SIMULATION: Generating fake ticket purchase record");
      return {
        success: true,
        ticketId: "sim-" + Math.random().toString(36).substring(2, 10),
        message: "Simulated ticket purchase recorded",
      };
    }

    throw error;
  }
};
