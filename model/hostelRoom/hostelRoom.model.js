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
            userId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            RoomNumber:{
                type: Number,
                require: true
                // type: mongoose.Schema.Types.ObjectId,
                // ref: "User"
            },
            startingDate:{
                type: String,
                require: true

            },
            endingDate:{
                type: String, 
                require: true

            }
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
            default:null    
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
    { timeStamp: true }
);

const hostelRoom = mongoose.model("hostelRoom", hostelRoomSchema);

module.exports = hostelRoom;
