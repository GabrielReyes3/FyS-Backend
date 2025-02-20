const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { db } = require("../config/firebase"); // Importar Firestore

// Registro de usuario
const register = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    if (!email || !username || !password || !role) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const userRef = db.collection("users").doc(email);
    const userSnap = await userRef.get();
    
    if (userSnap.exists) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario en Firestore
    const newUser = {
      email,
      username,
      password: hashedPassword, // Guardamos la contraseña encriptada
      role,
      date_register: new Date(),
      last_login: null,
    };

    await userRef.set(newUser);

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Correo y contraseña requeridos" });
    }

    // Buscar usuario en Firestore
    const userRef = db.collection("users").doc(email);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const userData = userSnap.data();

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Obtener los permisos según el rol desde la colección "roles"
    const roleRef = db.collection("roles").doc(userData.role); // Suponiendo que el role está en la colección roles
    const roleSnap = await roleRef.get();

    if (!roleSnap.exists) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    const roleData = roleSnap.data();
    const permissions = roleData.permissions || []; // Asumimos que el documento de rol contiene un array de permisos

    // Generar token JWT con los permisos
    const token = jwt.sign(
      { email, role: userData.role, permissions },  // Aquí se asignan los permisos obtenidos
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Actualizar el último login
    await userRef.update({ last_login: new Date() });

    res.status(200).json({ message: "Inicio de sesión exitoso", token, user: userData });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


module.exports = { register, login };
