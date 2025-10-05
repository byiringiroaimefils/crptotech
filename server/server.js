// Load environment variables first
const path = require('path');
const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}

console.log('Environment Variables Loaded:', {
    node_env: process.env.NODE_ENV,
    cloudinary_configured: !!process.env.CLOUDINARY_API_KEY,
    env_path: path.resolve(__dirname, '.env')
});

// initalizing express app
const express = require('express')
const app = express()
const port = 3001
const authMiddleware = require("./middleware/Auth")
const cookieParser = require("cookie-parser")
const dbConnection = require("./db/connect")

// importing account model
const accountModel = require("./models/Account")

// adding app middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
// allowing app to use cookie parser
app.use(cookieParser())

// Handle errors
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        message: 'Internal server error',
        details: err.message
    });
});
// enabling CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})


// importing routes
const accountRoutes = require("./routes/account/router")
const productRoutes = require("./routes/products")

// defining required routes 
app.use("/api/account", accountRoutes)
app.use("/api/products", productRoutes)
app.get("/api/dashboard",authMiddleware.Auth, async (req, res) => {
    try {
        const user = await accountModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Welcome to the dashboard", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))