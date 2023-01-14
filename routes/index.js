const routes = require("express").Router();
const {
  userRegister,
  userLogin,
  UserPasswordReset,
  UserForgetPassword,
  UserSingleView,
} = require("../controller/user.controller");
const { verifyToken } = require("../middleware/userAuth");
const AdminRoutes = require("./admin.routes");
const hostelRoutes = require("./hostel.routes");
const userRoutes = require("./user.routes");

routes.use("/admin", AdminRoutes);
routes.use("/hostel", hostelRoutes);
routes.use("/user", userRoutes);

// ---------------------------
// Public Routes//

routes.post("/register", userRegister);
routes.post("/login", userLogin);
routes.post("/forget-password", UserForgetPassword);
routes.get("/user-get", verifyToken, UserSingleView);
userRoutes.post("/reset-password/:userId/:token", UserPasswordReset);

module.exports = routes;
