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

const hostelRoom = mongoose.model("hostelRoom", hostelRoomSchema);

module.exports = hostelRoom;
