export const API_URL = "http://localhost:3001/api";
// const API_URL = "https://zora-be.onrender.com/api";

/**
 * Uploads an image file to the server
 * @param {File} file - The file to upload
 * @param {string} eventName - The name of the event (for filename generation)
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export async function uploadEventImage(file, eventName) {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("eventName", eventName);

    const response = await fetch(`${API_URL}/upload/image`, {
      method: "POST",
      body: formData,
      // No need to set Content-Type header, it's automatically set with FormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload image");
    }

    const data = await response.json();

    if (!data.success || !data.url) {
      throw new Error("Invalid response from server");
    }

    return data.url;
  } catch (error) {
    console.error("Error in uploadEventImage:", error);
    throw error;
  }
}
