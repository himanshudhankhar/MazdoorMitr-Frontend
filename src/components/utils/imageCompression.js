// utils/imageCompression.js
import imageCompression from "browser-image-compression";

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.3,              // 🔥 adjust based on use case
    maxWidthOrHeight: 1024,      // resize large images
    useWebWorker: true,
    initialQuality: 0.7,         // balance quality/size
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (err) {
    console.error("Compression failed:", err);
    return file; // fallback (important)
  }
};