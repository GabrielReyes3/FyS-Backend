const jwt = require("jsonwebtoken");

const verifyPermissions = (permissionsRequired, roleRequired) => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Acceso no autorizado, token requerido" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { permissions, role } = decoded;

      // Verificar si el rol es el requerido
      if (roleRequired && role !== roleRequired) {
        return res.status(403).json({ message: `Se requiere el rol ${roleRequired} para realizar esta acción` });
      }

      // Asegurarse de que 'permissions' no sea undefined
      if (!permissions || !Array.isArray(permissions)) {
        return res.status(401).json({ message: "Token no contiene permisos válidos" });
      }

      // Verificar si el usuario tiene los permisos requeridos
      const hasPermissions = permissionsRequired.every(permission => permissions.includes(permission));

      if (!hasPermissions) {
        return res.status(403).json({ message: "No tienes permisos suficientes para realizar esta acción" });
      }

      req.user = decoded; // Almacenamos la información del usuario para usarla en la API
      next();
    } catch (error) {
      console.error("Error al verificar token:", error);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
};

module.exports = verifyPermissions;
