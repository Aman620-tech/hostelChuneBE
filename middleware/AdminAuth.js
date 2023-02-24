const jwt = require("jsonwebtoken");
const AdminService = require("../model/Admin/Admin.function");

const tokenCreate = async (id) => {
  // console.log(id);
  const token = await jwt.sign({ id }, process.env.JWT_SECRET);
  return token;
};

const forgetPasswordToken = async (data, secret) => {
  // console.log(data,secret);
  const token = await jwt.sign({ data }, secret, {
    expiresIn: "30m",
  });
  return token;
};

const tokenVerify = async (token, secret) => {
  try {
    const verify = await jwt.verify(token, secret);
    if (verify) {
      return verify;
    }
  } catch (err) {
    return false;
  }
};

let verifyToken = async (req, res, next) => {
  try {
    const token = req.header("token");

    if (!token) {
      return res.json({
        status: 400,
        message: "No authorization token is sent with request",
      });
    }
    const id = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await AdminService.findUserById(id.id);
    req.user = user;
    next();
  } catch (err) {
    res.json({ status: 400, Error: err.message });
  }
};

// /////////////////////////////////////////////

const headerCheck = () => {


};

const adminAuthenticate = async (req, res, next) => {
  try {
    const token = req.header("token");

    if (!token) {
      return res.json({
        status: 400,
        message: "No authorization token is sent with request",
      });
    }
    const id = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await AdminService.findUserById(id.id);

    console.log("user.isAdmin",user.isAdmin);
    if (user.isAdmin === true) {
      req.user = user; // token
      return next();
    }
    return res.json({ status: 400, response: "Not a admin" });
  } catch (err) {
    res.json({ status: 400, Error: err.message });
  }
};

// || user.role === "subadmin"


module.exports = {
  adminAuthenticate,
  tokenVerify,
  verifyToken,
  forgetPasswordToken,

};

//
// user  token
