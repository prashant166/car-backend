const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user information
const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    // Verify the token using the secret from the environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user information to the request object
    req.user = { userId: decoded.userId };
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
