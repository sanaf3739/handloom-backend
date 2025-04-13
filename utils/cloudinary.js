const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete local file after successful upload
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.error("Local file deletion failed:", err.message);
    }
    return response;
    
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);

    // Try deleting the file in case of upload failure
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.error("Local file deletion failed (after error):", err.message);
    }

    return null;
  }
};

module.exports = { uploadOnCloudinary };
