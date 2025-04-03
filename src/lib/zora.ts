// @ts-nocheck

// src/lib/zora.ts
import { ethers } from "ethers";

// Zora Factory addresses (use the appropriate one for your network)
const ZORA_FACTORY_ADDRESS = {
  mainnet: "0xF74B146ce44CC162b601deC3BE331784DB111DC1",
  goerli: "0x2A2e09365D6Ae0F637A488AF6D1887f720D4F263", // For testing
  polygon: "0x3C1ebcF36Da30D2f638a71639b27135455f6CaC0",
};

// Simplified ABI for the Zora Factory
const ZORA_FACTORY_ABI = [
  "function createEdition(string memory name, string memory symbol, uint256 editionSize, uint256 royaltyBPS, address payable fundsRecipient) external returns (address)",
  "function createEditionWithMetadata(string memory name, string memory symbol, uint256 editionSize, uint256 royaltyBPS, address payable fundsRecipient, string memory description, string memory animationURI, string memory imageURI) external returns (address)",
];

export async function createZoraCollection(eventData) {
  try {
    // Connect to the user's wallet
    if (!window.ethereum)
      throw new Error("No wallet detected. Please install MetaMask.");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();

    // Create a new Zora collection for this event
    const zoraFactory = new ethers.Contract(
      ZORA_FACTORY_ADDRESS.goerli, // Use mainnet or polygon for production
      ZORA_FACTORY_ABI,
      signer
    );

    // Prepare metadata for the collection
    const name = `${eventData.name} Tickets`;
    const symbol =
      eventData.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase() + "TIX";
    const editionSize = parseInt(eventData.ticketQuantity);
    const royaltyBPS = 500; // 5% royalties

    console.log(
      `Creating Zora collection: ${name} (${symbol}) with ${editionSize} tickets`
    );

    // Create the collection with metadata
    const tx = await zoraFactory.createEditionWithMetadata(
      name,
      symbol,
      editionSize,
      royaltyBPS,
      signerAddress, // Funds recipient (the event organizer)
      eventData.description,
      "", // Animation URI (optional)
      eventData.imagePreview // Image URI
    );

    console.log("Transaction submitted:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);

    // Extract the collection address from the event logs
    // This depends on the specific event emitted by the Zora factory
    const event = receipt.events.find((e) => e.event === "EditionCreated");
    const collectionAddress = event.args.editionContractAddress;

    console.log("Collection created at:", collectionAddress);

    return {
      collectionAddress,
      transactionHash: tx.hash,
    };
  } catch (error) {
    console.error("Error creating Zora collection:", error);
    throw error;
  }
}

// PURCHASE TICKET FUNCTION
export async function purchaseTickets(collectionAddress, quantity, price) {
  try {
    if (!window.ethereum)
      throw new Error("No wallet detected. Please install MetaMask.");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    // Simplified ABI for Zora Edition contract
    const ZORA_EDITION_ABI = [
      "function purchase(uint256 quantity) external payable",
      "function totalSupply() external view returns (uint256)",
      "function balanceOf(address owner) external view returns (uint256)",
    ];

    // Connect to the event's NFT contract
    const ticketContract = new ethers.Contract(
      collectionAddress,
      ZORA_EDITION_ABI,
      signer
    );

    // Calculate price (convert from ETH to wei)
    const totalPrice = ethers.utils.parseEther(price.toString()).mul(quantity);

    console.log(
      `Purchasing ${quantity} tickets for ${ethers.utils.formatEther(
        totalPrice
      )} ETH`
    );

    // Purchase tickets
    const tx = await ticketContract.purchase(quantity, {
      value: totalPrice,
    });

    console.log("Transaction submitted:", tx.hash); 
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);

    return {
      transactionHash: tx.hash,
      quantity,
      totalPrice: ethers.utils.formatEther(totalPrice),
    };
  } catch (error) {
    console.error("Error purchasing tickets:", error);
    throw error;
  }
}

// TICKET VERIFICATION FUNCTIONALITY
export async function verifyTicket(collectionAddress, tokenId, expectedOwner) {
  try {
    // Use a provider that doesn't require user interaction
    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.g.alchemy.com/v2/YOUR_ALCHEMY_KEY" // Replace with your provider URL
    );

    // Simplified ABI for ERC721
    const ERC721_ABI = [
      "function ownerOf(uint256 tokenId) external view returns (address)",
      "function tokenURI(uint256 tokenId) external view returns (string)",
    ];

    // Connect to the NFT contract
    const ticketContract = new ethers.Contract(
      collectionAddress,
      ERC721_ABI,
      provider
    );

    // Get the owner of the token
    const owner = await ticketContract.ownerOf(tokenId);

    // Get the token metadata
    const tokenURI = await ticketContract.tokenURI(tokenId);

    // Check if the owner matches the expected owner
    const isOwnerMatch = expectedOwner.toLowerCase() === owner.toLowerCase();

    return {
      isValid: isOwnerMatch,
      owner,
      tokenURI,
      // You would also check if the ticket has been used before
      // This would require a separate database or smart contract
      isUsed: false, // Placeholder
    };
  } catch (error) {
    console.error("Error verifying ticket:", error);

    // If the token doesn't exist or other errors
    return {
      isValid: false,
      error: error.message,
    };
  }
}