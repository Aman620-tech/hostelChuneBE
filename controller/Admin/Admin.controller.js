const AdminServices = require("../../model/Admin/Admin.function");
const { uploadFile, DeleteFile } = require("../../utils/fileUpload");
const { genSalt, hash, compare } = require("bcrypt");
const { tokenCreate, tokenVerify, forgetPasswordToken } = require("../../middleware/userAuth");
const { welcomeMail, inviteMail, forgetPasswordMail } = require('../../utils/mail-Setup');

// const adminRegister = async (req, res, next) => {
//     try {
//         const {
//             firstName,
//             lastName,
//             email,
//             password,
//             mobileNumber,
//             role,
//             address,
//             dateOfBirth,
//             country,
//             state,
//             permission: {
//                 userManagement,
//                 hostelManagement,
//                 kycManagement,
//                 contentManagement,
//                 feedbackManagement,
//                 accountManagement
//             },
//             city,
//             pinCode,
//             gender,
//             adharCardNo,
//         } = req.body;

//         if (!firstName || !lastName || !email || !password || !mobileNumber) {
//             return res.json({ Status: 401, response: "Missing values" });
//         }

//         // if (role === "admin" || role === "subadmin") {
//         //     return res.json({ Status: 401, response: "Oops Not allowed" });
//         // }

//         const salt = await genSalt(8);
//         const hashPassword = await hash(password, salt);
//         // password = hashPassword;
//         const userData = {
//             firstName,
//             lastName,
//             email,
//             password,
//             role,
//             permission: {
//                 userManagement,
//                 hostelManagement,
//                 kycManagement,
//                 contentManagement,
//                 feedbackManagement,
//                 accountManagement
//             },
//             mobileNumber,
//             dateOfBirth,
//             address,
//             country,
//             state,
//             city,
//             pinCode,
//             gender,
//             adharCardNo,
//             active: true,
//             password: hashPassword,
//         };
//         let user = await AdminServices.userCreate(userData);
//         // console.log("user", user);
//         if (req.files) {
//             const profilePicture = req.files["image"];
//             console.log("first", profilePicture);
//             if (profilePicture) {
//                 const extensions = [".png", ".jpg", ".jpeg"];
//                 path = 'profile/'
//                 const fileLink = await uploadFile(profilePicture, path, extensions);
//                 // console.log(fileLink);
//                 const data = {
//                     image: {
//                         name: profilePicture.name,
//                         url: fileLink,
//                     },
//                 };
//                 user = await AdminServices.findUserByIdAndUpdate(user._id, data);
//             }
//         }
//         const token = await tokenCreate(user._id);
//         await welcomeMail({ email, password })

//         res.json({
//             status: 200,
//             response: "User Created",
//             user,
//             token,
//         });
//     } catch (err) {
//         res.json({ status: 400, response: err.message });
//     }
// };
const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ status: 401, response: "All fields are required" });
        }

        const user = await AdminServices.findUserByEmail(email);
        // console.log("user", user);
        if (!user) {
            return res.json({ status: 401, response: "user not found" });
        }
        // console.log(user.password);
        const passwordCompare = await compare(password, user.password);
        if (!passwordCompare) {
            return res.json({ status: 401, response: "In Correct Password " });
        }
        if (!user.active) {
            return res.json({
                status: 401,
                response:
                    "OOps your account is not active please mail to microcombusiness@gmail.com ",
            });
        }
        const token = await tokenCreate(user._id);
        res.json({ status: 200, response: " Logged Successful", user, token });
    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
};


const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.send({ status: 401, response: "email is required" });
        }
        const user = await AdminServices.findUserByEmail(email);
        if (!user) {
            return res.send({ status: 401, response: "Invalid email" });
        }
        const secret = process.env.JWT_SECRET + user.password;
        const userData = user._id + user.email;
        const token = await forgetPasswordToken(userData, secret);
        // const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
        const link = `${process.env.ADMIN_Frontend_Url}/reset-password/${user._id}/${token}`;
        await forgetPasswordMail({ link, email })
        return res.json({
            status: 200,
            response: "Mail Sent successfully",
        });
    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
};
const passwordReset = async (req, res, next) => {
    try {
        const { userId, token } = req.params;
        if (!userId || !token) {
            return res.send({ status: 401, response: "missing parameter" });
        }
        const { password, confirmPassword } = req.body;
        const user = await AdminServices.findUserById(userId);
        if (!user) {
            return res.send({ status: 401, response: "Missing parameter" });
        }
        const secret = process.env.JWT_SECRET + user.password;
        const verify = await tokenVerify(token, secret);
        if (!verify) {
            return res.send({ status: 401, response: "!!! oops Link expired" });
        }
        if (
            !password ||
            password == "" ||
            confirmPassword == "" ||
            !confirmPassword
        ) {
            return res.send({ status: 401, response: "Missing parameter" });
        }
        if (password !== confirmPassword) {
            return res.send({
                status: 401,
                response: "password doesn't match with confirm password",
            });
        }
        const salt = await genSalt(8);
        let hashPassword = await hash(password, salt);
        const data = { password: hashPassword };
        ////////////////////////////////
        const updateUser = await AdminServices.findUserByIdAndUpdate(user._id, data);
        res.send({
            status: 200,
            response: "Password updated successfully",
        });
    } catch (err) {
        res.send({ status: 400, response: err.message });
    }
};


const singleView = async (req, res, next) => {
    try {
        const user = await AdminServices.findUserById(req.user._id);
        if (!user) {
            return res.send({ status: 401, response: "User Not Found" });
        }
        res.json({ status: 200, response: "User profile", user });
    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
};
const passwordChange = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.json({ status: 401, response: "Missing Parameters" });
        }
        if (confirmPassword !== newPassword) {
            return res.json({ status: 401, response: "Password not match" });
        }
        if (currentPassword === newPassword) {
            return res.json({
                status: 401,
                response: "New Password can not be similar to the old",
            });
        }

        const user = await AdminServices.findUserById(req.user._id);

        const checkPassword = await compare(currentPassword, user.password);
        if (!checkPassword) {
            return res.json({
                status: 400,
                response: `Current password Don't Match`,
            });
        }

        const salt = await genSalt(8);
        const hashPassword = await hash(newPassword, salt);

        const userPassword = {
            password: hashPassword,
        };
        await AdminServices.findUserByIdAndUpdate(req.user._id, userPassword);
        const User = await AdminServices.findUserById(req.user._id);

        res.json({
            status: 200,
            response: "Password Updated Successfully",
            user: User,
        });
    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
};

const addSubAdmin = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            mobileNumber,
            role,
            address,
            dateOfBirth,
            country,
            state,
            permission: {
                userManagement,
                hostelManagement,
                kycManagement,
                contentManagement,
                feedbackManagement,
                accountManagement
            },
            city,
            pinCode,
            gender,
            adharCardNo,
        } = req.body;

        if (!firstName || !lastName || !email || !mobileNumber) {
            return res.json({ Status: 401, response: "Missing values" });
        }
        const password = (Math.random()).toString(36).substring(2);
        const salt = await genSalt(8);
        const hashPassword = await hash(password, salt);
        const userData = {
            firstName,
            lastName,
            email,
            role,
            mobileNumber,
            dateOfBirth,
            address,
            country,
            permission: {
                userManagement,
                hostelManagement,
                kycManagement,
                contentManagement,
                feedbackManagement,
                accountManagement
            },
            state,
            city,
            pinCode,
            gender,
            adharCardNo,
            active: true,
            password: hashPassword,
        };
        let user = await AdminServices.userCreate(userData);
        // console.log("user", user);
        await inviteMail({ email, password })
        res.json({
            status: 200,
            response: "User Invitation Send",
            user,
        });
    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
};

const updateUserPermissionById = async (req, res, next) => {
    try {
        const { userId } = req.params
        const {
            userManagement,
            hostelManagement,
            kycManagement,
            contentManagement,
            feedbackManagement,
            accountManagement
        } = req.body;
        const userData = {
            userManagement,
            hostelManagement,
            kycManagement,
            contentManagement,
            feedbackManagement,
            accountManagement
        }
        const User = await AdminServices.findUserByIdAndUpdate(userId, { permission: userData });

        res.json({
            status: 200,
            response: "Permission Updated Successfully",
            user: User,
        });

    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
}


const updateAdmin = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            mobileNumber,
            address,
            country,
            state,
            city,
            pinCode,
            gender,
            adharCardNo,
        } = req.body;
        const userData = {
            firstName,
            lastName,
            email,
            mobileNumber,
            address,
            country,
            state,
            city,
            pinCode,
            gender,
            adharCardNo,
        }

        const User = await AdminServices.findUserByIdAndUpdate(req.user._id, userData);
        if (req.files) {
            const profilePicture = req.files["image"];
            console.log("first", profilePicture);
            if (profilePicture) {
                const extensions = [".png", ".jpg", ".jpeg"];

                const fileLink = await uploadFile(profilePicture,extensions);
                // console.log(fileLink);
                const data = {
                    image: {
                        name: profilePicture.name,
                        url: fileLink,
                    },
                };
                  await AdminServices.findUserByIdAndUpdate(req.user._id, data);
            }
        }       
         const user = await AdminServices.findUserById(req.user._id);

        res.json({
            status: 200,
            response: "Password Updated Successfully",
            user,
        });

    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
}

module.exports = { passwordChange,adminLogin, forgetPassword, passwordReset,singleView, addSubAdmin, updateUserPermissionById ,updateAdmin,addSubAdmin}
















// Hostel - > 
// Rating
// Entry
// type of room:{
// Price
// hostel Id
// }
// like :{
// by,
// like true,false}
// ,mode of payment
// hostel for boys 
// About
// timing
// facilites
