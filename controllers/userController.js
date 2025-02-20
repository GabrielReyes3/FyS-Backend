// controllers/userController.js
const { db } = require("../config/firebase");

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map(doc => doc.data());
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    // Verificar que el usuario exista
    const userRef = db.collection("users").doc(email);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar usuario
    await userRef.delete();
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
    try {
      const { email } = req.params;
      const { username, role, password } = req.body;
  
      // Construir objeto de actualización solo con valores definidos
      const updateData = {};
      if (username) updateData.username = username;
      if (role) updateData.role = role;
      if (password) updateData.password = password;
  
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No hay datos válidos para actualizar" });
      }
  
      const userRef = db.collection("users").doc(email);
      await userRef.update(updateData);
  
      res.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
    }
  };
  

// Actualizar rol de usuario
const updateRol = async (req, res) => {
  const { email } = req.params;  // Obtén el email desde los parámetros de la URL
  const { role } = req.body;  // Obtén el nuevo rol desde el cuerpo de la solicitud

  if (!email || !role) {
    return res.status(400).json({ message: "Email y rol son requeridos" });
  }

  try {
    // Asegúrate de que el email esté correctamente formateado
    const userRef = db.collection("users").doc(email);  // Verifica que "users" sea la colección correcta
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualiza el rol del usuario
    await userRef.update({ role: role });

    return res.status(200).json({ message: "Rol actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    return res.status(500).json({ message: "Error al actualizar rol" });
  }
};

// Agregar rol
const addRol = async (req, res) => {
  try {
    const { roleName } = req.body;

    // Asegúrate de que el roleName no esté vacío
    if (!roleName || roleName.trim() === "") {
      return res.status(400).json({ message: "Role name is required." });
    }

    // Intentamos agregar el rol a la colección "roles"
    await db.collection("roles").doc(roleName).set({
      roleName: roleName,  // Aquí puedes agregar más campos según lo necesites
    });

    res.status(201).json({ message: "Rol agregado con éxito." });
  } catch (error) {
    console.error("Error al agregar rol:", error);
    res.status(500).json({ message: "Error al agregar rol", error: error.message });
  }
};


// Eliminar rol
// Eliminar rol
const deleteRol = async (req, res) => {
  try {
    const { role } = req.params;  // Asegúrate de que 'role' es el parámetro correcto

    // Verificar si el rol existe
    const roleRef = db.collection("roles").doc(role);
    const roleSnap = await roleRef.get();

    if (!roleSnap.exists) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    // Eliminar el rol
    await roleRef.delete();
    res.status(200).json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    res.status(500).json({ message: "Error al eliminar rol" });
  }
};




// Agregar permiso
// Agregar permiso
const addPermission = async (req, res) => {
  try {
    const { role, permission } = req.body;

    if (!role || !permission) {
      return res.status(400).json({ message: "Rol o permiso no proporcionados" });
    }

    const roleRef = db.collection("roles").doc(role);
    const roleSnap = await roleRef.get();

    if (!roleSnap.exists) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    const roleData = roleSnap.data();

    // Verificar si el permiso ya está agregado
    if (roleData.permissions.includes(permission)) {
      return res.status(400).json({ message: "El permiso ya está asignado a este rol" });
    }

    // Agregar el nuevo permiso al rol
    roleData.permissions.push(permission);

    await roleRef.update({ permissions: roleData.permissions });

    res.status(200).json({ message: "Permiso agregado correctamente" });
  } catch (error) {
    console.error("Error al agregar permiso:", error);
    res.status(500).json({ message: "Error al agregar permiso" });
  }
};



// Eliminar permiso
// Eliminar permiso
const deletePermission = async (req, res) => {
  try {
    const { role, permission } = req.body;

    if (!role || !permission) {
      return res.status(400).json({ message: "Rol o permiso no proporcionados" });
    }

    const roleRef = db.collection("roles").doc(role);
    const roleSnap = await roleRef.get();

    if (!roleSnap.exists) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    const roleData = roleSnap.data();

    // Verificar si el permiso existe
    const permissionIndex = roleData.permissions.indexOf(permission);
    if (permissionIndex === -1) {
      return res.status(400).json({ message: "Permiso no encontrado en este rol" });
    }

    // Eliminar el permiso
    roleData.permissions.splice(permissionIndex, 1);

    await roleRef.update({ permissions: roleData.permissions });

    res.status(200).json({ message: "Permiso eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar permiso:", error);
    res.status(500).json({ message: "Error al eliminar permiso" });
  }
};



module.exports = { getUsers, deleteUser, updateUser, updateRol, addRol, deleteRol, addPermission, deletePermission };
