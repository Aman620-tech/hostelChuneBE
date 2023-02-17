const userRoutes = require("express").Router();
const { UserSingleView, passwordChange,UserDeleteByToken,updateUserByToken } = require("../controller/user.controller");
const { userAuthenticate } = require('../middleware/userAuth')


userRoutes.get("/view", userAuthenticate, UserSingleView);
userRoutes.delete("/delete", userAuthenticate, UserDeleteByToken);
userRoutes.patch("/password-change", userAuthenticate, passwordChange);
userRoutes.patch("/update", userAuthenticate, updateUserByToken);

module.exports = userRoutes;
