const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Debug log to verify environment variables
const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

console.log('Cloudinary Config Check:', {
    cloud_name_exists: !!config.cloud_name,
    api_key_exists: !!config.api_key,
    api_secret_exists: !!config.api_secret,
    env_path: path.resolve(__dirname, '../.env'),
    full_config: config
});

if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error('Missing required Cloudinary configuration. Check your .env file.');
}

// Cloudinary Configuration
cloudinary.config(config);

module.exports = cloudinary;