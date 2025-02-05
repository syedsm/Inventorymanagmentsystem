const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    try {
        // console.log("=== [AUTHENTICATION MIDDLEWARE STARTED] ===");

        // Extract the authorization header
        const authorizationHeader = req.headers['authorization'];
        // console.log("Authorization Header:", authorizationHeader);

        // Check if the header exists
        if (!authorizationHeader) {
            // console.warn("Access Denied: No authorization header provided");
            return res.status(401).json({ error: 'Access denied, token missing' });
        }

        // Split the header to retrieve the token
        const tokenArray = authorizationHeader.split(' ');

        // Validate the format of the authorization header
        if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
            // console.warn("Invalid Authorization Header Format:", authorizationHeader);
            return res.status(401).json({ error: 'Invalid Authorization header format' });
        }

        const token = tokenArray[1];
        // console.log("Token Extracted:", token);

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error("JWT Verification Error:", err.message);

                if (err.name === 'TokenExpiredError') {
                    console.warn("Token Expired for Token:", token);
                    return res.status(401).json({ error: 'Token expired' });
                }

                console.error("Invalid Token Provided:", token);
                return res.status(403).json({ error: 'Invalid token' });
            }
            // console.log("Token Successfully Verified");
            // console.log("Decoded Payload:", user);
            // Attach the decoded user to the request object for use in controllers
            req.user = user;
            // console.log("=== [AUTHENTICATION MIDDLEWARE PASSED] ===");
            next();
        });
    } catch (error) {
        console.error("Unexpected Error in Authentication Middleware:", error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authenticateToken;
