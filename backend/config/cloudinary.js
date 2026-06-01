
const cloudinary = require('cloudinary').v2;

// Cloudinary SDK auto-reads CLOUDINARY_URL env var automatically
// Format: cloudinary://api_key:api_secret@cloud_name
// Fallback: use individual vars if CLOUDINARY_URL is not set
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}
// If CLOUDINARY_URL is set, the SDK picks it up automatically - no config needed

module.exports = cloudinary;
