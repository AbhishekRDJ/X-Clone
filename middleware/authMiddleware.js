const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token with the same secret key used for signing the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to the request
    next(); // Pass control to the next middleware/route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = verifyToken;
