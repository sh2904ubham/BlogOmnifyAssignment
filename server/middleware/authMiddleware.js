import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.header("Authorization") && req.header("Authorization").split(" ")[1];

  // Check if no token is provided
  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;  // Attach user data to the request
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
