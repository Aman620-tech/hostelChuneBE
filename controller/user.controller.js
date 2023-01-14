const UserServices = require("../model/user/user.function");
const { uploadFile, DeleteFile } = require("../services/fileUpload");
const { genSalt, hash, compare } = require("bcrypt");
const { tokenCreate, forgetPasswordToken } = require("../middleware/userAuth");
const { createTransport } = require("nodemailer");
const { welcomeMail, forgetPasswordMail } = require('../services/mail-Setup')

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
        console.log("user", user);
        if (req.files) {
            const profilePicture = req.files["image"];
            console.log("first", profilePicture);
            if (profilePicture) {
                const extensions = [".png", ".jpg", ".jpeg"];
                const fileLink = await uploadFile(profilePicture, extensions);
                console.log(fileLink);
                const data = {
                    image: {
                        name: profilePicture.name,
                        url: fileLink,
                    },
                };
                await UserServices.findUserByIdAndUpdate(user._id, data);
            }
        }
        const User = await UserServices.findUserById(user._id);

        const token = await tokenCreate(user._id);
        await welcomeMail({ email, password })

        res.json({
            status: 200,
            response: "User Created",
            user: User,
            //   cart,
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

        const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
        // const link = `https://63c2e3027b1d840008721d06--serene-gumption-44c645.netlify.app/reset-password/${user._id}/${token}`;

        await forgetPasswordMail({ link, email })
        mailOption = {
            to: email,
            subject: "Forget password link",
            html: `<!DOCTYPE html>
  
        <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
        
        <head>
            <title></title>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <style>
                * {
                    box-sizing: border-box;
                }
        
                body {
                    margin: 0;
                    padding: 0;
                }
        
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: inherit !important;
                }
        
                #MessageViewBody a {
                    color: inherit;
                    text-decoration: none;
                }
        
                p {
                    line-height: inherit
                }
        
                .desktop_hide,
                .desktop_hide table {
                    mso-hide: all;
                    display: none;
                    max-height: 0px;
                    overflow: hidden;
                }
        
                @media (max-width:700px) {
                    .desktop_hide table.icons-inner {
                        display: inline-block !important;
                    }
        
                    .icons-inner {
                        text-align: center;
                    }
        
                    .icons-inner td {
                        margin: 0 auto;
                    }
        
                    .row-content {
                        width: 100% !important;
                    }
        
                    .mobile_hide {
                        display: none;
                    }
        
                    .stack .column {
                        width: 100%;
                        display: block;
                    }
        
                    .mobile_hide {
                        min-height: 0;
                        max-height: 0;
                        max-width: 0;
                        overflow: hidden;
                        font-size: 0px;
                    }
        
                    .desktop_hide,
                    .desktop_hide table {
                        display: table !important;
                        max-height: none !important;
                    }
                }
            </style>
        </head>
        
        <body style="background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
            <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                    <tr>
                        <td>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
                                role="presentation"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                class="row-content stack" role="presentation"
                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;"
                                                width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="100%">
                                                            <div class="spacer_block"
                                                                style="height:20px;line-height:20px;font-size:1px;"> </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
                                role="presentation"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content"
                                                role="presentation"
                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;"
                                                width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="41.666666666666664%">
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                class="icons_block block-2" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad"
                                                                        style="vertical-align: middle; color: #000000; font-family: inherit; font-size: 14px; text-align: left; padding-top: 5px; padding-bottom: 5px;">
                                                                        <table align="left" cellpadding="0" cellspacing="0"
                                                                            class="alignment" role="presentation"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                            <tr>
                                                                                <td
                                                                                    style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px;">
                                                                                    <img align="center" alt="" class="icon"
                                                                                        height="32" src="${this.logo}"
                                                                                        style="display: block; height: auto; margin: 0 auto; border: 0;"
                                                                                        width="125" /></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                        <td class="column column-2"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="58.333333333333336%">
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                class="empty_block block-2" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad"
                                                                        style="padding-right:0px;padding-bottom:5px;padding-left:0px;padding-top:5px;">
                                                                        <div></div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
                                role="presentation"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                class="row-content stack" role="presentation"
                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;"
                                                width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="100%">
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                class="heading_block block-3" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad"
                                                                        style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:120px;text-align:center;width:100%;">
                                                                        <h1
                                                                            style="margin: 0; color: #272727; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 48px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
                                                                            <strong>Forgot Password</strong></h1>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                class="text_block block-4" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad"
                                                                        style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                                                        <div style="font-family: sans-serif">
                                                                            <div class="txtTinyMce-wrapper"
                                                                                style="font-size: 12px; mso-line-height-alt: 24px; color: #5f5f5f; line-height: 2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
                                                                                <p
                                                                                    style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 32px;">
                                                                                    <span style="font-size:16px;">Reset password link has been generated successfully and it is valid till 30 min Only . Please click below to reset password. </span></p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                class="button_block block-5" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad"
                                                                        style="padding-bottom:25px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:center;">
                                                                        <div align="center" class="alignment">
                                                                            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:42px;width:145px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#0061ff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a
                                                                                
                                                                            
                                                                                    href=${link}
                                                                                
                                                                                style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#0061ff;border-radius:4px;width:auto;border-top:0px solid #133C55;font-weight:400;border-right:0px solid #133C55;border-bottom:0px solid #133C55;border-left:0px solid #133C55;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"
                                                                                target="_blank"><span
                                                                                    style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span
                                                                                        dir="ltr"
                                                                                        style="word-break: break-word; line-height: 32px;">Reset Password</span></span></a>
                                                                            <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="pad"
                                                                        style="padding-bottom:115px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:center;">
                                                                        <div align="center" class="alignment" style="font-family:Arial, Helvetica Neue, Helvetica, sans-serif; color: #5f5f5f;">
                                                                            In case the above button does not work copy paste this link
                                                                            
                                                                            ${link}
    
                                                                             </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4"
                                role="presentation"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #030317;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                class="row-content stack" role="presentation"
                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;"
                                                width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="100%">
                                                            <div class="spacer_block"
                                                                style="height:60px;line-height:60px;font-size:1px;"> </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5"
                                role="presentation"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #030317;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                class="row-content stack" role="presentation"
                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;"
                                                width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="100%">
                                                            <table border="0" cellpadding="10" cellspacing="0"
                                                                class="paragraph_block block-1" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div
                                                                            style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
                                                                            <p style="margin: 0;"><span
                                                                                    style="color: #ffffff;">
                                                                                    Right Reserved.</span></p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table border="0" cellpadding="10" cellspacing="0"
                                                                class="paragraph_block block-2" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div
                                                                            style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
                                                                            <p style="margin: 0;">
                                                                                <span style="color: #ffffff;">
                                                                                    <a href="" rel="noopener" style="text-decoration: underline; color: #0068a5;" target="_blank">
                                                                                        <span style="color: #ffffff; text-decoration: underline;">Terms and Conditions</span>
                                                                                    </a>
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6"
                                role="presentation"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #030317;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                class="row-content stack" role="presentation"
                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;"
                                                width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="100%">
                                                            <div class="spacer_block"
                                                                style="height:60px;line-height:60px;font-size:1px;"> </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table><!-- End -->
        </body>
        
        </html>`,
            // from: "microcombusiness@gmail.com",
            from: process.env.User_Email,
        };
        const setup = await createTransport({
            service: "gmail",
            auth: {
                user: process.env.User_Email,
                pass: process.env.User_Password,
            },
        });

        await setup.sendMail(mailOption, (error, info) => {
            if (error) {
                return res.send({ Error: error });
            }
            console.log(`Email sent: ${info.response}`);
            return res.json({
                status: 200,
                response: "Mail Sent successfully",
                info: info.response,
            });
        });
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
            response: "Password updated successfully ",
            user: updateUser,
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

const addUser = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            mobileNumber,
            role,
            address,
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

        if (!firstName || !lastName || !email || !password || !mobileNumber) {
            return res.json({ Status: 401, response: "Missing values" });
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
        let user = await UserServices.userCreate(userData);
        console.log("user", user);
        if (req.files) {
            const profilePicture = req.files["image"];
            // console.log("first", profilePicture);
            if (profilePicture) {
                const extensions = [".png", ".jpg", ".jpeg"];
                const fileLink = await uploadFile(profilePicture, extensions);
                console.log(fileLink);
                const data = {
                    image: {
                        name: profilePicture.name,
                        url: fileLink,
                    },
                };
                await UserServices.findUserByIdAndUpdate(user._id, data);
            }
        }
        const User = await UserServices.findUserById(user._id);

        const token = await tokenCreate(user._id);
        mailOption = {
            to: email,
            subject: "Welcome Mail",
            html: `<!DOCTYPE html>
          
              <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
              
              <head>
                  <title></title>
                  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
                  <style>
                      * {
                          box-sizing: border-box;
                      }
              
                      body {
                          margin: 0;
                          padding: 0;
                      }
              
                      a[x-apple-data-detectors] {
                          color: inherit !important;
                          text-decoration: inherit !important;
                      }
              
                      #MessageViewBody a {
                          color: inherit;
                          text-decoration: none;
                      }
              
                      p {
                          line-height: inherit
                      }
              
                      .desktop_hide,
                      .desktop_hide table {
                          mso-hide: all;
                          display: none;
                          max-height: 0px;
                          overflow: hidden;
                      }
              
                      @media (max-width:700px) {
                          .desktop_hide table.icons-inner {
                              display: inline-block !important;
                          }
              
                          .icons-inner {
                              text-align: center;
                          }
              
                          .icons-inner td {
                              margin: 0 auto;
                          }
              
                          .row-content {
                              width: 100% !important;
                          }
              
                          .mobile_hide {
                              display: none;
                          }
              
                          .stack .column {
                              width: 100%;
                              display: block;
                          }
              
                          .mobile_hide {
                              min-height: 0;
                              max-height: 0;
                              max-width: 0;
                              overflow: hidden;
                              font-size: 0px;
                          }
              
                          .desktop_hide,
                          .desktop_hide table {
                              display: table !important;
                              max-height: none !important;
                          }
                      }
                  </style>
              </head>
              
              <body style="background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                  <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                          <tr>
                              <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
                                      role="presentation"
                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
                                      <tbody>
                                          <tr>
                                              <td>
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                      class="row-content stack" role="presentation"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;"
                                                      width="680">
                                                      <tbody>
                                                          <tr>
                                                              <td class="column column-1"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                  width="100%">
                                                                  <div class="spacer_block"
                                                                      style="height:20px;line-height:20px;font-size:1px;"> </div>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
                                      role="presentation"
                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
                                      <tbody>
                                          <tr>
                                              <td>
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content"
                                                      role="presentation"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;"
                                                      width="680">
                                                      <tbody>
                                                          <tr>
                                                              <td class="column column-1"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                  width="41.666666666666664%">
                                                                  <table border="0" cellpadding="0" cellspacing="0"
                                                                      class="icons_block block-2" role="presentation"
                                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                      width="100%">
                                                                      <tr>
                                                                          <td class="pad"
                                                                              style="vertical-align: middle; color: #000000; font-family: inherit; font-size: 14px; text-align: left; padding-top: 5px; padding-bottom: 5px;">
                                                                              <table align="left" cellpadding="0" cellspacing="0"
                                                                                  class="alignment" role="presentation"
                                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                  <tr>
                                                                                      <td
                                                                                          style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px;">
                                                                                          <img align="center" alt="" class="icon"
                                                                                              height="32" src="${this.logo}"
                                                                                              style="display: block; height: auto; margin: 0 auto; border: 0;"
                                                                                              width="125" /></td>
                                                                                  </tr>
                                                                              </table>
                                                                          </td>
                                                                      </tr>
                                                                  </table>
                                                              </td>
                                                              <td class="column column-2"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                  width="58.333333333333336%">
                                                                  <table border="0" cellpadding="0" cellspacing="0"
                                                                      class="empty_block block-2" role="presentation"
                                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                      width="100%">
                                                                      <tr>
                                                                          <td class="pad"
                                                                              style="padding-right:0px;padding-bottom:5px;padding-left:0px;padding-top:5px;">
                                                                              <div></div>
                                                                          </td>
                                                                      </tr>
                                                                  </table>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
                                      role="presentation"
                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
                                      <tbody>
                                          <tr>
                                              <td>
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                      class="row-content stack" role="presentation"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;"
                                                      width="680">
                                                      <tbody>
                                                          <tr>
                                                              <td class="column column-1"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                  width="100%">
                                                                  <table border="0" cellpadding="0" cellspacing="0"
                                                                      class="heading_block block-3" role="presentation"
                                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                      width="100%">
                                                                      <tr>
                                                                          <td class="pad"
                                                                              style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:120px;text-align:center;width:100%;">
                                                                              <h1
                                                                                  style="margin: 0; color: #272727; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 48px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
                                                                                  <strong>Welcome to Micro-Com</strong></h1>
                                                                          </td>
                                                                      </tr>
                                                                  </table>
                                                                  <table border="0" cellpadding="0" cellspacing="0"
                                                                      class="text_block block-4" role="presentation"
                                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                      width="100%">
                                                                      <tr>
                                                                          <td class="pad"
                                                                              style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                                                              <div style="font-family: sans-serif">
                                                                                  <div class="txtTinyMce-wrapper"
                                                                                      style="font-size: 12px; mso-line-height-alt: 24px; color: #5f5f5f; line-height: 2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
                                                                                      <p
                                                                                          style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 32px;">
                                                                                          <span style="font-size:16px;">Thank you for signing up with us. Please find your login details below</span></p>
                                                                                          <p
                                                                                          style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 32px;">
                                                                                          <span style="font-size:16px;"><b>Email : </b>${email} </span></p>
                                                                                          <p
                                                                                          style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 32px;">
                                                                                          <span style="font-size:16px;"><b>Password : </b> ${password}</span></p>
                                                                                  </div>
                                                                              </div>
                                                                          </td>
                                                                      </tr>
                                                                  </table>
                                                                  <table border="0" cellpadding="0" cellspacing="0"
                                                                      class="button_block block-5" role="presentation"
                                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                      width="100%">
                                                                      <tr>
                                                                          <td class="pad"
                                                                              style="padding-bottom:115px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:center;">
                                                                              <div align="center" class="alignment">
                                                                                  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:42px;width:145px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#0061ff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a
                                                                                      style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#0061ff;border-radius:4px;width:auto;border-top:0px solid #133C55;font-weight:400;border-right:0px solid #133C55;border-bottom:0px solid #133C55;border-left:0px solid #133C55;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"
                                                                                      target="_blank"><span
                                                                                          style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span
                                                                                              dir="ltr"
                                                                                              style="word-break: break-word; line-height: 32px;">Start Using Micro-Com</span></span></a>
                                                                                  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                              </div>
                                                                          </td>
                                                                      </tr>
                                                                  </table>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4"
                                      role="presentation"
                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #030317;" width="100%">
                                      <tbody>
                                          <tr>
                                              <td>
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                      class="row-content stack" role="presentation"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;"
                                                      width="680">
                                                      <tbody>
                                                          <tr>
                                                              <td class="column column-1"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                  width="100%">
                                                                  <div class="spacer_block"
                                                                      style="height:60px;line-height:60px;font-size:1px;"> </div>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5"
                                      role="presentation"
                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #030317;" width="100%">
                                      <tbody>
                                          <tr>
                                              <td>
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                      class="row-content stack" role="presentation"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;"
                                                      width="680">
                                                      <tbody>
                                                          <tr>
                                                              <td class="column column-1"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                  width="100%">
                                                                  <table border="0" cellpadding="10" cellspacing="0"
                                                                      class="paragraph_block block-1" role="presentation"
                                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                      width="100%">
                                                                      <tr>
                                                                          <td class="pad">
                                                                              <div
                                                                                  style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
                                                                                  <p style="margin: 0;"><span
                                                                                          style="color: #ffffff;">2022 micro-com.com All
                                                                                          Right Reserved.</span></p>
                                                                              </div>
                                                                          </td>
                                                                      </tr>
                                                                  </table>
                                                                  <table border="0" cellpadding="10" cellspacing="0"
                                                                      class="paragraph_block block-2" role="presentation"
                                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                      width="100%">
                                                                      <tr>
                                                                          <td class="pad">
                                                                              <div
                                                                                  style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
                                                                                  <p style="margin: 0;">
                                                                                      <span style="color: #ffffff;">
                                                                                          <a href="#" rel="noopener" style="text-decoration: underline; color: #0068a5;" target="_blank">
                                                                                              <span style="color: #ffffff; text-decoration: underline;">Terms and Conditions</span>
                                                                                          </a>
                                                                                      </span>
                                                                                  </p>
                                                                              </div>
                                                                          </td>
                                                                      </tr>
                                                                  </table>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6"
                                      role="presentation"
                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #030317;" width="100%">
                                      <tbody>
                                          <tr>
                                              <td>
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                      class="row-content stack" role="presentation"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;"
                                                      width="680">
                                                      <tbody>
                                                          <tr>
                                                              <td class="column column-1"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                  width="100%">
                                                                  <div class="spacer_block"
                                                                      style="height:60px;line-height:60px;font-size:1px;"></div>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </td>
                          </tr>
                      </tbody>
                  </table><!-- End -->
              </body>
              
              </html>`,
            from: process.env.User_Email,
        };
        const setup = await createTransport({
            service: "gmail",
            auth: {
                user: process.env.User_Email,
                pass: process.env.User_Password,
            },
        });

        await setup.sendMail(mailOption, (error, info) => {
            if (error) {
                // return res.send({ Error: error });
            }
            console.log(`Email sent: ${info}`);
        });

        res.json({
            status: 200,
            response: "User Created",
            user: User,
            token,
        });
    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
};
const updateUserByToken = async (req, res, next) => {
    try {

    } catch (err) {
        res.json({ status: 400, response: err.message });
    }
}




module.exports = {
    userRegister,
    userLogin,
    UserPasswordReset,
    UserForgetPassword,
    UserSingleView,
    addUser,
};
