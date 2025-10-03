exports.logout = async (req, res) => {
    try {
        // Step 1: Clear the JWT token cookie
        res.clearCookie("jwtToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
            sameSite: 'lax', // Protect against CSRF
            path: '/' // Ensure cookie is cleared from all paths
        });

        // Step 2: Send success response
        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });

    } catch (error) {
        console.error("Error during logout:", error);

        // Step 3: Send error response
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging out."
        });
    }
};
