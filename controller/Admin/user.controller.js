const UserServices = require("../../model/user/user.function");
const { genSalt, hash, compare } = require("bcrypt");
const { inviteMail, forgetPasswordMail } = require('../../utils/mail-Setup')

const allUser = async (req, res, next) => {
    try {
        const { role, active } = req.body
        if (!role || !active) {
            return res.json({ status: 401, response: "Missing Parameters" });
        }
        const user = await UserServices.viewAllUser({ role, active });
        res.json({ status: 200, response: `All ${role}`, user });

    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
};

const userDelete = async (req, res, next) => {
    try {
        const { userId } = req.params
        const user = await UserServices.findUserById(userId)
        if (user.role == "admin") {
            return res.json({ status: 400, response: "Admin Can not be deleted" });

        }
        await DeleteFile(user.image.url)

        await UserServices.findUserByIdAndDelete(userId);
        res.json({ status: 200, response: "User Deleted Successfully" });
    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
};

const addUser = async (req, res, next) => {
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

module.exports = { allUser, userDelete, addUser }
