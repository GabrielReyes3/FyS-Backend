const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register); // Nueva ruta para registrar usuarios
router.post("/login", login);

module.exports = router;
