// File: src/services/walletService.js
let currentAccount = null;

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
  if (!isMetaMaskInstalled()) {
    throw new Error(
      "MetaMask is not installed. Please install MetaMask to continue."
    );
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    currentAccount = accounts[0];

    // Set up event listeners for account changes
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return currentAccount;
  } catch (error) {
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
 * Send ETH transaction
 */
export const sendTransaction = async (toAddress, amount) => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  if (!currentAccount) {
    await connectWallet();
  }

  try {
    // Convert amount to wei (1 ETH = 10^18 wei)
    const amountInWei = window.web3.utils.toWei(amount.toString(), "ether");

    // Prepare transaction parameters
    const transactionParameters = {
      from: currentAccount,
      to: toAddress,
      value: window.web3.utils.toHex(amountInWei),
    };

    // Send transaction
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    return {
      transactionHash: txHash,
      from: currentAccount,
      to: toAddress,
      value: amount,
    };
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
};
