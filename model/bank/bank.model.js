const mongoose = require("mongoose");

const hostelSchema = mongoose.Schema(
  {
    bankName: {
      type: String,
      default:null
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    currency:{
        type: String,
        default:null
    },
    accountNumber: {
      type: Number,
      default:null
    },
    ifscCode: {
      type: String,
      default:null
    },
    country: {
      type: String,
      default:null
    },
    state: {
      type: String,
      default:null
    },
    city: {
      type: String,
      default:null

    },
    pinCode: {
      type: Number,
      default:null

    },
    active:{
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timeStamp: true }
);

const User = mongoose.model("hostel", hostelSchema);

module.exports = User;
