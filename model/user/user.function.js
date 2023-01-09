const User = require("./user.model");

class UserServices {
  viewAllUser = async () => {
    const user = await User.find({ role: "user" });
    return user;
  };
  viewAllBusinessUser = async () => {
    const user = await User.find({ role: "business" });
    return user;
  };
  ViewAllSubAdmin = async () => {
    const user = await User.find({ role: "subadmin" });
    return user;
  };
  userCreate = async (data) => {
    const user = await User.create(data);
    return user;
  };
  findUserById = async (userId) => {
    const user = await User.findById(userId);
    return user;
  };
  findUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
  };
  findUserByIdAndUpdate = async (userId, data) => {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    );
    return user;
  };
}
module.exports = new UserServices();
