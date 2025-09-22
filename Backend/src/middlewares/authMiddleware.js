const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token provided");

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).send("No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

module.exports = authMiddleware;
