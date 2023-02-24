const mongoose = require("mongoose");

const hostelRoomSchema = mongoose.Schema(
    {
        hostelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "hostel"
        },
        active: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            enum: ["budget", "Luxury", "Boutique", ""]
        },
        rate: {
            type: Number,
        },
        active: {
            type: Boolean,
            default: false,
        },
        facilities: [{
            type: {
                type: String,
            },
            available: {
                type: Boolean,
            },
            startTime: {
                type: TimeRanges,
            },
            endTime: {
                type: TimeRanges,
            }
        }],
        numberOfRoom: {
            type: Number,
            require: true
        },
        bookedRoom: {
            type: Number,
            default: null
        },
        image: [{
            name: {
                type: String,
            },
            url: {
                type: String,
            },
        }],

    },
    { timestamps: true }
);

const hostelRoom = mongoose.model("hostelRoom", hostelRoomSchema);

module.exports = hostelRoom;
