const hostelRoutes = require("express").Router();
const { UserSingleView, passwordChange } = require("../controller/user.controller");
const { hostelAdd,hostelFindById,updateHostel } = require("../controller/hostel.controller");
const {BusinessAuthenticate  } = require('../middleware/userAuth')

hostelRoutes.get("/register",BusinessAuthenticate , hostelAdd);
hostelRoutes.get("/view/:hostelId",BusinessAuthenticate , hostelFindById);


module.exports = hostelRoutes
