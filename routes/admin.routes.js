const AdminRoutes = require("express").Router();
const { addUser } = require("../controller/user.controller");

AdminRoutes.post("/add-sub-admin", addUser);
AdminRoutes.post("/add-admin", addUser);
AdminRoutes.post("/add-admin", addUser);
AdminRoutes.post("/add-admin", addUser);
AdminRoutes.post("/add-admin", addUser);

module.exports = AdminRoutes;
