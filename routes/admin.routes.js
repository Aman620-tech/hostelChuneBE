const AdminRoutes = require("express").Router();
const {addUser,updateUserPermissionById, UserSingleView, 
    passwordChange,AdminAllUser,
    updateUserByToken } = require("../controller/user.controller");
const { adminAuthenticate } = require('../middleware/userAuth')
const { adminHostelFindById,adminAllHostelFind} = require('../controller/hostel.controller')

// AdminRoutes.post("/add-user",adminAuthenticate, addUser);
AdminRoutes.post("/password-change",adminAuthenticate, passwordChange);
AdminRoutes.get("/view",adminAuthenticate , UserSingleView);
AdminRoutes.post("/all-user",adminAuthenticate, AdminAllUser);
AdminRoutes.patch("/permission-change/:userId",adminAuthenticate, updateUserPermissionById);
AdminRoutes.post("/add-admin",adminAuthenticate, addUser);

AdminRoutes.patch("/update",adminAuthenticate, updateUserByToken);


// user
AdminRoutes.post("/add-user",adminAuthenticate, addUser);



// manage permission
AdminRoutes.post("/permission/:userId",adminAuthenticate, updateUserPermissionById);



AdminRoutes.patch("/hostel/:hostelId",adminAuthenticate, adminHostelFindById);
AdminRoutes.patch("/all/hostel",adminAuthenticate, adminAllHostelFind);


module.exports = AdminRoutes;