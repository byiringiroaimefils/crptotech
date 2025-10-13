// Load environment variables first
const dotenv = require('dotenv');
const result = dotenv.config();


// initalizing express app
const express = require('express')
// const session = require("express-session");
const app = express()
const port = 3001
const cors = require("cors")
const authMiddleware = require("./middleware/Auth")
const cookieParser = require("cookie-parser")
const dbConnection = require("./db/connect")
const passport = require("./config/passport");

// importing account model
const accountModel = require("./models/Account")
const orderModel = require("./models/Order")

// Setup session (required by passport)
// app.use(
//   session({
//     secret: process.env.JWT_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// Initialize Passport
app.use(passport.initialize());
const googleAuthRoutes = require("./routes/googleAuth");
app.use("/api/auth", googleAuthRoutes);



// app.use(passport.session());

// adding app middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())
// allowing app to use cors
app.use(cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Allow credentials (cookies)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))
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
    res.header('Access-Control-Allow-Origin', process.env.FRONTED_URL || 'http://localhost:3000') // update to match the domain you will make the request from
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
const cartRoutes = require("./routes/cart/router")
const ordersRoutes = require("./routes/ordersRoutes")

// defining required routes 
app.use("/api/account", accountRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", ordersRoutes)
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