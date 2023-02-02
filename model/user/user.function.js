const User = require("./user.model");

class UserServices {
  viewAllUser = async ({ role, active }) => {
    const user = await User.find({ role, active });
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
    await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    );
    const user = await this.findUserById(userId)
    return user;
  };
  findUserByIdAndDelete = async (userId, data) => {
    await User.findByIdAndDelete(userId)
    const user = await this.findUserById(userId)
    return user;
  };
}
module.exports = new UserServices();
