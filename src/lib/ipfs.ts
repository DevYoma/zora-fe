/* eslint-disable @typescript-eslint/ban-ts-comment */
// src/lib/ipfs.ts
// @ts-expect-error
import { NFTStorage, File } from "nft.storage";

const NFT_STORAGE_KEY = "YOUR_NFT_STORAGE_API_KEY"; // Get this from https://nft.storage
const client = new NFTStorage({ token: NFT_STORAGE_KEY });

interface UploadToIPFSResult {
  url: string;
  metadata: Awaited<ReturnType<typeof client.store>>;
}

export async function uploadToIPFS(file: File): Promise<UploadToIPFSResult> {
  try {
    // Upload the file to IPFS
    const metadata = await client.store({
      name: file.name,
      description: "Event image",
      image: file,
    });

    // The URL for the image is in the metadata
    const url = metadata.data.image.href;

    return {
      url,
      metadata,
    };
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
}
