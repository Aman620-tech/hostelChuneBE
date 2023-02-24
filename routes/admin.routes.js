const AdminRoutes = require("express").Router();
const { allUser, userDelete, addUser } = require("../controller/Admin/user.controller");
const { adminLogin, addSubAdmin, forgetPassword, passwordReset, passwordChange
    , singleView, updateUserPermissionById, updateAdmin } = require("../controller/Admin/Admin.controller");

const { adminAuthenticate } = require('../middleware/AdminAuth')

const { adminHostelFindById, adminAllHostelFind, updateHostel } = require('../controller/Admin/hostel.controller')

// AdminRoutes.post("/register", adminRegister);
AdminRoutes.post("/login", adminLogin);
AdminRoutes.post("/forget-password", forgetPassword);
AdminRoutes.post("/reset-password/:userId/:token", passwordReset);

AdminRoutes.post("/add-admin", adminAuthenticate, addSubAdmin);
AdminRoutes.post("/password-change", adminAuthenticate, passwordChange);
AdminRoutes.get("/view", adminAuthenticate, singleView);
AdminRoutes.post("/all-user", adminAuthenticate, allUser);
AdminRoutes.patch("/permission-change/:userId", adminAuthenticate, updateUserPermissionById);
AdminRoutes.post("/add-user", adminAuthenticate, addSubAdmin);
AdminRoutes.patch("/update", adminAuthenticate, updateAdmin);


AdminRoutes.post("/add-admin", adminAuthenticate, addUser);

// user
AdminRoutes.delete("/delete-user/:userId", adminAuthenticate, userDelete);



// manage permission
AdminRoutes.post("/permission/:userId", adminAuthenticate, updateUserPermissionById);


//  hostel
AdminRoutes.post("/all/hostel", adminAuthenticate, adminAllHostelFind);
AdminRoutes.get("/hostel/:hostelId", adminAuthenticate, adminHostelFindById);
AdminRoutes.patch("/hostel/:hostelId", adminAuthenticate, updateHostel);


module.exports = AdminRoutes;