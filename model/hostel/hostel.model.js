const mongoose = require("mongoose");

const hostelSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    hostelRoom: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    verified: {
      type: Boolean,
      default: false,
    },
    number: {
      type: Number,
      require: true
    },
    address: {
      type: String,
      require: true
    },
    country: {
      type: String,
      require: true
    },
    state: {
      type: String,
      require: true
    },
    city: {
      type: String,
      require: true
    },
    nearByLocation: {
      type: String,
      default: null
    },
    pinCode: {
      type: Number,
    },
    businessLogo: {
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
