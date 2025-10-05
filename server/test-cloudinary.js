const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function testCloudinaryConnection() {
    try {
        // Log the configuration being used
        const config = {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        };
        
        console.log('Testing Cloudinary connection with:', {
            cloud_name: config.cloud_name,
            api_key: config.api_key ? config.api_key.substring(0, 4) + '...' : undefined,
            api_secret: config.api_secret ? '****' : undefined
        });

        // Configure Cloudinary
        cloudinary.config(config);

        // Test the connection by requesting account info
        const result = await cloudinary.api.ping();
        console.log('Cloudinary connection successful:', result);
    } catch (error) {
        console.error('Cloudinary connection error:', error);
    }
}

testCloudinaryConnection();