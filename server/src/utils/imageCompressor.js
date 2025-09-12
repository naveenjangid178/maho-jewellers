const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET',
});

// Function to compress the image to under 16KB
const compressToUnder16KB = async (inputImagePath, outputImagePath) => {
  let quality = 100; // Start with 100% quality
  const maxSize = 16 * 1024; // 16KB in bytes
  
  try {
    let buffer = await sharp(inputImagePath)
      .resize(1024) // Resize if needed
      .toFormat('jpeg')
      .jpeg({ quality })
      .toBuffer();

    let fileSize = buffer.length;

    // Reduce quality iteratively if the image is too large
    while (fileSize > maxSize && quality > 10) {
      quality -= 10; // Decrease quality by 10%
      buffer = await sharp(inputImagePath)
        .resize(1024) // Resize if needed
        .toFormat('jpeg')
        .jpeg({ quality })
        .toBuffer();
      fileSize = buffer.length;
      console.log(`Current file size: ${fileSize / 1024} KB, Quality: ${quality}%`);
    }

    console.log(`Final image size: ${fileSize / 1024} KB`);

    // Write the optimized image to the output path
    fs.writeFileSync(outputImagePath, buffer);

    return outputImagePath;
  } catch (error) {
    console.error('Error compressing the image:', error);
  }
};

// Function to upload image to Cloudinary
const uploadToCloudinary = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);
    console.log('Image uploaded to Cloudinary:', result.url);
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
  }
};

// Complete process
const processImage = async () => {
  const inputImagePath = 'path_to_your_image/image.jpg'; // Path to input image
  const outputImagePath = path.join(__dirname, 'compressed_image.jpg'); // Path to save compressed image

  const compressedImagePath = await compressToUnder16KB(inputImagePath, outputImagePath);
  if (compressedImagePath) {
    await uploadToCloudinary(compressedImagePath);
  }
};

// Run the process
processImage();
