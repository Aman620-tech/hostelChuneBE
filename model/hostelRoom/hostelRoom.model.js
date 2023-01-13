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
        usedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        // hostelRoom: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User"
        // }],
        charge: {
            type: Boolean,
            default: false,
        },
        facilities: [{
            type: {
                type: String,
            },
            available: {
                type: Boolean,
                default: true,
            },
            startTime: {
                type: TimeRanges,
            },
            endTime: {
                type: Date,
            }
        }],
        numberOfRoom: {
            type: Number,
            require: true

        },
        image: [{
            imageName: {
                type: String,
            },
            imagePath: {
                type: String,
            },
        }],
        
    },
    { timeStamp: true }
);

const User = mongoose.model("hostelRoom", hostelRoomSchema);

module.exports = User;
