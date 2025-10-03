// imporing mongoose module
const mongoose = require("mongoose")

// creating account schema
const accountSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "usrname is required"],
        unique: true
    },
    username: {
        type: String,
        required: [true, "username is required"],
    },
    phoneNumber: {
        type: String,
        minlength: [8, "enter number above 8 letter"]
    },
    role: {
        type: String,
        required: [true, "role is required"],
        enum: ["administrator","sub-administrator", "lawyer", "user"]
    },
    lawyerLicenseNumber: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: [true, "role is required"],
        minlength: [8, "enter password above 7 characters"]
    },
    isActivated: {
        type: Boolean,
        default: false
    },
})

// creating account model/collection based on account schema
const accountModel = mongoose.model("account", accountSchema)

// exporing account model
module.exports = accountModel