const mongoose = require("mongoose");

const hostelSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "subadmin", "hostel", "user"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    address: {
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
    image: {
      imageName: {
        type: String,
      },
      imagePath: {
        type: String,
      },
    },
    mobileVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    lastLogin: {
      type: String,
    },
    kyc: {
      type: Boolean,
      default: false,
    },
  },
  { timeStamp: true }
);

const User = mongoose.model("hostel", hostelSchema);

module.exports = User;
