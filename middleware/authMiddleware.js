// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

// Middleware para proteger rutas
const protect = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // 'Bearer token'
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guardamos el usuario decodificado en el request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = protect;
