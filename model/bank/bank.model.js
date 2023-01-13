const mongoose = require("mongoose");

const hostelSchema = mongoose.Schema(
  {
    bankName: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    currency:{
        type: String,
    },
    accountNumber: {
      type: Number,
    },
    ifscCode: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    pinCode: {
      type: Number,
    },
    passbookImage: {
      imageName: {
        type: String,
      },
      imagePath: {
        type: String,
      },
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
