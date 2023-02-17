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
        const hostel = await Hostel.findById(hostelId);
        return hostel;
    };
    findHostelByIdAndUserId = async (hostelId,userId) => {
        const hostel = await Hostel.find(hostelId,userId);
        return hostel;
    };
    findUserByIdAndUpdate = async (hostelId, data) => {
         await User.findByIdAndUpdate(
            hostelId,
            { $set: data },
            { new: true }
        );
        const hostel = await this.findHostelById(hostelId)

        return hostel;
    };
}
module.exports = new HostelServices();
