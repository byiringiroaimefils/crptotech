const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Step 1: Redirect user to Google for login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Step 2: Google redirects here after authentication
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login", session: false }),
  (req, res) => {
    // Generate JWT (fixed env variable)
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      "process.env.JWT_SECRET",
      { expiresIn: "1d" }
    );

    // Set JWT cookie
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend
    res.redirect("http://localhost:3000/account");
  }
);

module.exports = router;
