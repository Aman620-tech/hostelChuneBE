const UserServices = require("../../model/user/user.function");
const { uploadFile, DeleteFile } = require("../../utils/fileUpload");
const { genSalt, hash, compare } = require("bcrypt");
const { tokenCreate, tokenVerify, forgetPasswordToken } = require("../../middleware/userAuth");
const { welcomeMail, forgetPasswordMail } = require('../../utils/mail-Setup')

const userRegister = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            role,
            mobileNumber,
            address,
            country,
            state,
            city,
            pinCode,
            gender,
            adharCardNo,
        } = req.body;

        if (!firstName || !lastName || !email || !password || !mobileNumber) {
            return res.json({ Status: 401, response: "Missing values" });
        }

        if (role === "admin" || role === "subadmin") {
            return res.json({ Status: 401, response: "Oops Not allowed" });
        }
        let userEmail = await UserServices.findUserByEmail ({email});

        if (userEmail){
            return res.json({ Status: 401, response: "Email Already Exists" });
        }
        const salt = await genSalt(8);
        const hashPassword = await hash(password, salt);
        // password = hashPassword;
        const userData = {
            firstName,
            lastName,
            email,
            role,
            mobileNumber,
            address,
            country,
            state,
            city,
            pinCode,
            gender,
            adharCardNo,
            active: true,
            password: hashPassword,
        };
        let user = await UserServices.userCreate(userData);
        // console.log("user", user);
        if (req.files) {
            const profilePicture = req.files["image"];
            console.log("first", profilePicture);
            if (profilePicture) {
                const extensions = [".png", ".jpg", ".jpeg"];
                path = 'profile/'
                const fileLink = await uploadFile(profilePicture,path,extensions);
                // console.log(fileLink);
                const data = {
                    image: {
                        name: profilePicture.name,
                        url: fileLink,
                    },
                };
                user = await UserServices.findUserByIdAndUpdate(user._id, data);
            }
        }
        const token = await tokenCreate(user._id);
        await welcomeMail({ email, password })

        res.json({
            status: 200,
            response: "User Created",
            user,
            token,
        });
    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
};

const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ status: 401, response: "All fields are required" });
        }

        const user = await UserServices.findUserByEmail(email);
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

const UserForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.send({ status: 401, response: "email is required" });
        }
        const user = await UserServices.findUserByEmail(email);
        if (!user) {
            return res.send({ status: 401, response: "Invalid email" });
        }
        const secret = process.env.JWT_SECRET + user.password;
        const userData = user._id + user.email;
        const token = await forgetPasswordToken(userData, secret);
        // const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
        const link = `${process.env.Frontend_Url}/reset-password/${user._id}/${token}`;
        await forgetPasswordMail({ link, email })
        return res.json({
            status: 200,
            response: "Mail Sent successfully",
        });
    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
};
const UserPasswordReset = async (req, res, next) => {
    try {
        const { userId, token } = req.params;
        console.log("object");
        if (!userId || !token) {
            return res.send({ status: 401, response: "missing parameter" });
        }

        const { password, confirmPassword } = req.body;

        const user = await UserServices.findUserById(userId);
        if (!user) {
            return res.send({ status: 401, response: "Missing parameter" });
        }
        const secret = process.env.JWT_SECRET + user.password;
        const verify = await tokenVerify(token, secret);
        console.log("verify", verify);
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
        const updateUser = await UserServices.findUserByIdAndUpdate(user._id, data);
        res.send({
            status: 200,
            response: "Password updated successfully",
        });
    } catch (err) {
        res.send({ status: 400, response: err.message });
    }
};

// ------------------ token ------------------------------
const UserSingleView = async (req, res, next) => {
    try {
        const user = await UserServices.findUserById(req.user._id);
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

        const user = await UserServices.findUserById(req.user._id);

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
        await UserServices.findUserByIdAndUpdate(req.user._id, userPassword);
        const User = await UserServices.findUserById(req.user._id);

        res.json({
            status: 200,
            response: "Password Updated Successfully",
            user: User,
        });
    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
};

const updateUserByToken = async (req, res, next) => {
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

        const User = await UserServices.findUserByIdAndUpdate(req.user._id, userData);
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
                  await UserServices.findUserByIdAndUpdate(req.user._id, data);
            }
        }       
         const user = await UserServices.findUserById(req.user._id);

        res.json({
            status: 200,
            response: "Password Updated Successfully",
            user,
        });

    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
}
const UserDeleteByToken = async (req, res, next) => {
    try {
        await UserServices.findUserByIdAndUpdate(req.user._id, { active: false, isDeleted: true });
        res.json({ status: 200, response: "User Deleted Successfully" });
    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
};

module.exports = {
    userRegister,
    userLogin,
    UserForgetPassword,
    UserPasswordReset,
    UserSingleView,
    UserDeleteByToken,
    passwordChange,
    updateUserByToken,
};
