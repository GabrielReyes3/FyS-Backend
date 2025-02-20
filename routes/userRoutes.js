const express = require("express");
const { getUsers, deleteUser, updateUser, updateRol, addRol, deleteRol, addPermission, deletePermission } = require("../controllers/userController");
const verifyPermissions = require("../middleware/verifyPermissions");

const router = express.Router();

// Rutas protegidas por permisos
router.get("/getUsers", verifyPermissions(["get_user"]), getUsers);
router.delete("/deleteUser/:email", verifyPermissions(["delete_user"]), deleteUser);
router.put("/updateUser/:email", verifyPermissions(["update_user"]), updateUser);
router.put("/updateRol/:email", verifyPermissions(["update_user"], "master"), updateRol);  // Se mantiene la verificación de permisos y rol 'master'
router.post("/addRol", verifyPermissions(["add_permissions"]), addRol);
router.delete("/deleteRol/:role", verifyPermissions(["delete_permissions"], "master"), deleteRol); // Aquí también se incluye el rol 'master'
router.post("/addPermission", verifyPermissions(["add_permissions"], "master"), addPermission);
router.delete("/deletePermission", verifyPermissions(["delete_permissions"]), deletePermission);

module.exports = router;
