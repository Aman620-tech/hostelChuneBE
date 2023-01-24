const Hostel = require("./hostel.model");

class HostelServices {
    viewAllHostel = async () => {
        const hostel = await Hostel.find();
        return hostel;
    };

   hostelCreate = async (data) => {
        const hostel = await Hostel.create(data);
        return hostel;
    };
    findHostelById = async (hostelId) => {
        const user = await Hostel.findById(hostelId);
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
module.exports = new HostelServices();
