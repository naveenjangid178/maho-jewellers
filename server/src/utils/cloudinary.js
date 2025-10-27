import sharp from "sharp";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Compress image to under 16KB (or given limit)
 * @param {Buffer} inputBuffer
 * @param {number} sizeLimit
 * @returns {Promise<Buffer>}
 */
const compressImage = async (inputBuffer, sizeLimit = 300 * 1024) => {
  let quality = 80;
  let buffer = await sharp(inputBuffer)
    .resize(800, 800, { fit: "inside" })
    .jpeg({ quality })
    .toBuffer();

  while (buffer.length > sizeLimit && quality > 10) {
    quality -= 10;
    buffer = await sharp(buffer).jpeg({ quality }).toBuffer();
  }

  if (buffer.length > sizeLimit) {
    throw new Error("Could not compress image under size limit");
  }

  return buffer;
};

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @returns {Promise<string>} Cloudinary URL
 */
const uploadOnCloudinary = async (fileBuffer) => {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    throw new Error("Invalid file buffer provided");
  }

  try {
    const compressedBuffer = await compressImage(fileBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "catalogues",
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload error: ${error.message}`));
          } else {
            resolve(result.secure_url);
          }
        }
      );

      streamifier.createReadStream(compressedBuffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export { uploadOnCloudinary };