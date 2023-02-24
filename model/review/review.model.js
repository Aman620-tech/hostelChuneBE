const mongoose = require("mongoose");

const InquirySchema = mongoose.Schema(
    {
        hostelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        rating: {
            type: Number,
            required: true
        },
        description: {
            type: String,
        },
        like: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]

    },
    { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", InquirySchema);

module.exports = Inquiry;
