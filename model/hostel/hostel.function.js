const Hostel = require("./hostel.model");

class UserServices {
    viewAllUser = async () => {
        const user = await Hostel.find();
        return user;
    };

    userCreate = async (data) => {
        const user = await Hostel.create(data);
        return user;
    };
    findUserById = async (hostelId) => {
        const user = await Hostel.findById(hostelId);
        return user;
    };
    findUserByEmail = async (userId) => {
        const user = await Hostel.findOne({ userId });
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
