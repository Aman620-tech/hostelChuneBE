const AdminRoutes = require("express").Router();
const { UserSingleView, passwordChange, addUser,AdminAllUser,updateUserPermissionById } = require("../controller/user.controller");
const { adminAuthenticate } = require('../middleware/userAuth')


AdminRoutes.post("/add-user",adminAuthenticate, addUser);
AdminRoutes.get("/view",adminAuthenticate , UserSingleView);
AdminRoutes.post("/all-user",adminAuthenticate, AdminAllUser);
AdminRoutes.patch("/permission-change/:userId",adminAuthenticate, updateUserPermissionById);
AdminRoutes.post("/add-admin", addUser);

module.exports = AdminRoutes;
