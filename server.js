require("dotenv").config();  // Esta línea debe estar al principio del archivo
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");  // Asegúrate de que esté importando las rutas correctas
const userRoutes = require("./routes/userRoutes"); // Asegúrate de tener un archivo de rutas para las APIs de usuarios

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);  // Asegúrate de que las rutas de los usuarios estén en esta carpeta

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
