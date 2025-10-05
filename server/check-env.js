const fs = require('fs');
const path = require('path');

// Check if .env file exists and is readable
const envPath = path.resolve(__dirname, '.env');
console.log('Checking .env file at:', envPath);

try {
    const envExists = fs.existsSync(envPath);
    console.log('.env file exists:', envExists);
    
    if (envExists) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n').length;
        console.log('.env file contains', lines, 'lines');
        console.log('First few characters:', envContent.substring(0, 50) + '...');
    }
} catch (error) {
    console.error('Error checking .env file:', error);
}