
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Determine if Cloudinary is configured (via URL or individual vars)
const useCloudinary = process.env.CLOUDINARY_URL || (
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET
);

let upload;

if (useCloudinary) {
  // Use Cloudinary storage in production
  const cloudinary = require('../config/cloudinary');
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const isVideo = file.mimetype.startsWith('video/');
      return {
        folder: 'popartsdvg',
        resource_type: isVideo ? 'video' : 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'webm'],
        transformation: isVideo ? [] : [{ quality: 'auto', fetch_format: 'auto' }],
      };
    },
  });

  upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for videos
    fileFilter: (req, file, cb) => {
      const isImage = file.mimetype.startsWith('image/');
      const isVideo = file.mimetype.startsWith('video/');
      if (isImage || isVideo) {
        return cb(null, true);
      } else {
        cb(new Error('Only images and videos are allowed'));
      }
    }
  });

  console.log('✅ Using Cloudinary for file storage');
} else {
  // Fallback: local disk storage (dev only or if cloudinary not configured)
  const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp' : 'public/uploads/';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
      const isImage = file.mimetype.startsWith('image/');
      const isVideo = file.mimetype.startsWith('video/');
      if (isImage || isVideo) {
        return cb(null, true);
      } else {
        cb(new Error('Only images and videos are allowed'));
      }
    }
  });

  console.log('⚠️ Using local disk storage (uploads may not persist in production)');
}

module.exports = upload;
