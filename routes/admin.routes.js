const AdminRoutes = require("express").Router();
const { UserSingleView, passwordChange, addUser } = require("../controller/user.controller");
const { adminAuthenticate } = require('../middleware/userAuth')


AdminRoutes.post("/add-user",adminAuthenticate, addUser);
AdminRoutes.get("/view",adminAuthenticate , UserSingleView);
AdminRoutes.post("/add-admin", addUser);
AdminRoutes.post("/add-admin", addUser);
AdminRoutes.post("/add-admin", addUser);

module.exports = AdminRoutes;
