import { v2 as cloudinary } from 'cloudinary';

// Config is applied lazily at request time; missing vars will cause the
// upload route to return a 500 rather than crashing the entire build.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
