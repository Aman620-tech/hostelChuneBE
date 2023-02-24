const Admin = require("./Admin.model");

class AdminServices {
  viewAllUser = async ({ role, active }) => {
    const admin = await Admin.find({ role, active });
    return admin;
  };
  userCreate = async (data) => {
    const admin = await Admin.create(data);
    return admin;
  };
  findUserById = async (adminId) => {
    const admin = await Admin.findById(adminId);
    return admin;
  };
  findUserByEmail = async (email) => {
    const admin = await Admin.findOne({ email });
    return admin;
  };
  findUserByIdAndUpdate = async (adminId, data) => {
    await Admin.findByIdAndUpdate(
        adminId,
      { $set: data },
      { new: true }
    );
    const admin = await this.findUserById(adminId)
    return admin;
  };
  findUserByIdAndDelete = async (adminId) => {
    await Admin.findByIdAndDelete(adminId)
    const admin = await this.findUserById(adminId)
    return admin;
  };
}
module.exports = new AdminServices();
