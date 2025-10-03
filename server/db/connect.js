// imporing mongoose module
const mongoose = require("mongoose")

// connecting express app to mongo db
mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : "mongodb://localhost:27017/e-commerce", )
.then(()=>{
    console.log("Successfully Connected to MongoDB")
})
.catch((err)=>{
    console.log("Error connecting to MongoDB", err)
})

// exporting mongodb connction
module.exports = mongoose