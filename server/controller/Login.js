const accountModel = require("../models/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.Login = async (req, res) => {
    const { email, password } = req.body;

    // Step 1: Validate Input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Both email and password are required"
        });
    }

    try {
// Step 2: Check if user exists
const user = await accountModel.findOne({ email });
if (!user) {
  return res.status(404).json({
    success: false,
    message: "User with this email does not exist",
  });
}

// Step 3: Check if user uses JWT authentication
if (user.authProvider !== "jwt") {
  return res.status(400).json({
    success: false,
    message: "This user can only log in using Google",
  });
}


        // Step 5: Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        // Step 6: Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            "process.env.JWT_SECRET",
            { expiresIn: "1d" }
        );

        // Step 7: Set the token in an HTTP-only cookie
        res.cookie("jwtToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
            sameSite: process.env.NODE_ENV === 'production'?'none':'lax', // Protect against CSRF
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/' // Ensure cookie is available across all paths
        });

        // Step 8: Return success response with token
        return res.status(200).json({
            success: true,
            message: "user logged in successfully",
            token: token, // Include token in response for frontend access
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            token, 
        });
    }
};
