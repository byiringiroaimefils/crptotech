const jwt = require('jsonwebtoken');

exports.Auth = (req, res, next) => {
    const token = req.cookies.jwtToken;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Failed to authenticate token"
            });
        }
        req.user = decoded;
        next();
    });
};
