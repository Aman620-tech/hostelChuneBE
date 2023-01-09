const AdminRoutes = require("express").Router();
const { addSubAdmin } = require("../controller/user.controller");

AdminRoutes.post("/add-admin", addSubAdmin);

module.exports = AdminRoutes;
