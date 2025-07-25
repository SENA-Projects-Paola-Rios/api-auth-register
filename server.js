// server.js// server.js

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config(); // cargar variables de entorno

const app = express();
app.use(express.json()); // para leer JSON del cuerpo de las peticiones

// conectar a base de datos
connectDB();

// rutas
app.use("/api", require("./routes/auth"));

// iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
