// routes/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/*
  Ruta: POST /api/register
  Función: Registrar un nuevo usuario
*/
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si ya existe el usuario
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

/*
  Ruta: POST /api/login
  Función: Autenticar usuario y generar token
*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generar token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful.", token });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

/*
  Ruta: GET /api/user
  Función: Obtener datos del usuario autenticado
*/
router.get("/user", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // excluye la contraseña
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User data retrieved successfully.", user });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
