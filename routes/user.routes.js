const userRoutes = require("express").Router();
const { UserSingleView, passwordChange } = require("../controller/user.controller");
const { userAuthenticate } = require('../middleware/userAuth')


userRoutes.get("/view", userAuthenticate, UserSingleView);
module.exports = userRoutes;
