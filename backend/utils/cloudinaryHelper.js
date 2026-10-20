const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (fileInput, folder = 'eliteedu/chat') => {
  if (!fileInput) return '';
  if (typeof fileInput === 'string' && fileInput.startsWith('http')) {
    return fileInput;
  }
  const result = await cloudinary.uploader.upload(fileInput, {
    folder,
    resource_type: 'auto'
  });
  return result.secure_url;
};

module.exports = { cloudinary, uploadToCloudinary };
