// initalizing express app
const express = require('express')
const app = express()
const port = 3001
const cors = require("cors")
const authMiddleware = require("./middleware/Auth")
const cookieParser = require("cookie-parser")
const dbConnection = require("./db/connect")

// importing account model
const accountModel = require("./models/Account")

// adding app middleware
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


// importing account routes
const accountRoutes = require("./routes/account/router")
// defining required routes 
app.use("/api/account",accountRoutes)
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