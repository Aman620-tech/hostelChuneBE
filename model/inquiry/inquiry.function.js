const Inquiry = require("./inquiry.model");

class InquiryServices {
    viewAllUser = async ({ role, active }) => {
        const inquiry = await Inquiry.find({ role, active });
        return inquiry;
    };
    userCreate = async (data) => {
        const inquiry = await Inquiry.create(data);
        return inquiry;
    };
    findUserById = async (inquiryId) => {
        const inquiry = await Inquiry.findById(inquiryId);
        return inquiry;
    };

    findUserByIdAndUpdate = async (inquiryId, data) => {
        await Inquiry.findByIdAndUpdate(
            inquiryId,
            { $set: data },
            { new: true }
        );
        const inquiry = await this.findUserById(inquiryId)
        return inquiry;
    };
}
module.exports = new InquiryServices();

