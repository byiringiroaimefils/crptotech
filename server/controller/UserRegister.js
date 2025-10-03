const accountModel = require("../../../models/Account");
const bcrypt = require("bcrypt");

exports.Register = async (req, res) => {
    const { username, email, password, phoneNumber } = req.body;
    const role = "user";

    // Step 1: Basic Input Validation
    if (!username || !email || !password || !phoneNumber) {
        return res.status(400).json({
            success: false,
            message: "All fields username, email, password, phoneNumber are required."
        });
    }

    try {
        // Step 2: Check if email or username already exists
        const existingUser = await accountModel.findOne({
            email
        });

        // check if email is used by another account
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // check if password is longer than 7 characters
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // check if phone number is longer than 7 characters
        if (phoneNumber.length < 8) {
            return res.status(400).json({
                success: false,
                message: "phoneNumber must be at least 8 characters long"
            });
        }
        // Step 3: Hash password safely
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (hashError) {
            return res.status(500).json({
                success: false,
                message: "Error while hashing password. Please try again."
            });
        }

        // Step 4: Create new account
        const newAccount = new accountModel({
            username,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            isActivated: true
        });

        await newAccount.save();
        // return message if user account was created
        return res.status(201).json({
            success: true,
            message: "User account created successfully."
        });

    } catch (error) {
        // log an error if an expected error happen

        console.error("User Registration Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating User account."
        });
    }
};
