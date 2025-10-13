const express = require("express");
const router = express.Router();
const accountModel = require("../../models/Account");
const registerController = require("../../controller/UserRegister");
const adminregisterController = require("../../controller/adminRegister");
const loginController = require("../../controller/Login");
const logoutController = require("../../controller/logout");
const authMiddleware = require("../../middleware/Auth");

// Routes
router.post("/adminregister", adminregisterController.Register);
router.post("/register", registerController.Register);
router.post("/login", loginController.Login);
router.get("/logout", authMiddleware.Auth, logoutController.logout);

// ✅ Update user profile (JWT-based)
router.put("/update", authMiddleware.Auth, async (req, res) => {
  try {
    const userId = req.user.id; // from JWT payload
    const { username, phoneNumber, email } = req.body;

    if (!username && !phoneNumber && !email) {
      return res.status(400).json({
        success: false,
        message: "No update fields provided",
      });
    }

    // Find user first to check their authProvider
    const user = await accountModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If user registered via OAuth (e.g., Google), restrict updates
    if (user.authProvider === "oauth") {
      // Only allow phoneNumber update
      const updatedUser = await accountModel.findByIdAndUpdate(
        userId,
        { phoneNumber },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Only phone number updated (OAuth account).",
        user: updatedUser,
      });
    }

    // Otherwise, allow all fields
    const updatedUser = await accountModel.findByIdAndUpdate(
      userId,
      { username, phoneNumber, email },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile.",
    });
  }
});

module.exports = router;
