const mongoose = require("mongoose");

const InquirySchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        active: {
            type: Boolean,
            default: true,
        },
        email: {
            type: String,
            lowercase: true,
        },
        description: {
            type: String,
        }
    },
    { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", InquirySchema);

module.exports = Inquiry;
