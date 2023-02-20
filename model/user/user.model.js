const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "subadmin", "business", "user"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    isDeleted:{
      type: Boolean,
      default: false,
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
      name: {
        type: String,
        default: "image",
      },
      url: {
        type: String,
        default:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIEAAACBCAMAAADQfiliAAAAMFBMVEXk5ueutLfo6eqssbTq7O2orrK7wMPa3d7S1dfGyszMz9Hg4+TCxsnd4OG4vcCzuLuHxgkrAAAC/0lEQVR4nO2a626rMAyAwSYXAiTv/7YntIytFQ022Kl0lE+bNG0//DVxnIvXdY1Go9FoNBqNRqPxPwKQv39++Ep8F2YbU4p29lN1CQBvjcF+A00/u6Fm/C4g7uE3CUy+2kCA79/CbxLRVVGALh7GfziECgrgPsbPmDhpO0AoCeRRSIuuwpnA6jCpCjhzJpDRFFgoAn3SM5go8fM8zFqpAPNpEmwKXkmhuA5fFXQMBmr8XBZGDQXwpDTcUFmSiSGACoNAKwU7CisSLDkPV4z8ciDWgn0arPiBhZWHK9ICA7Ua7ThpA85KWMEgbMBMg3VzEE6EhWvQJ2EDxzbohQ08NxHFdye+gWkG4gb8TETptcAeA+m1MHENMEpvTdwRED+jDJFr4GUFOhiZ04CLsAE/FeUPirztGUfxMxJ3GqQPKJmFZRDlBfJhmSGgcFTOcC4MSeXiONBvDEbpUY18VpSvyBuER6TNQLwa7Qq0edBJww1KWdK4N/9C2KTRqj4owqmCWhb+KqSig5G+Kh1hC5XJ1Hjazovy+HG/wqPyrjDN5sDBYKjX6xmmuX+VQEwV469A521CRPP46tPs6jfccsTFh3Ecg3fLNxp+AMNfqhrAAJ3Ln97GlKf/0XSLdh6Dm9a/qEeHyYX4DIwvifj4RRz9ojka+aM/o3+uSGjWpNTJCgA3p6MycGRhPUgX52EZe86TJqLo8syjb0tD/8Eh+k7IAVxkx39KJBEHWEp74Qkm+bv5sG5Cl+M/He4d3D912TngeH0qoGM/qB8qXB4GcPcHYHMIl7IBwr0M+IuxVwS4zzZFMLKTgdzhpSpwm29wowh8UOA1nuBmFTgkMfqwsjnwA+M6B/yHdJoC+T41KUzBA+q1HriNPYYCKRXILyUXwEgZBHZnkaVAmAfpUvQGoTBdaKZwOP/PNeUh6Alv7toCZytSckv+wEllBG4zhw+eTIL6EJxMA/Mfbi5RfvDU2RTfKDY/WF2Mq5TPCfqJmCm+vCfUxxSbYFCDkkCj0Wg0vss/Bz8hBPfP7w0AAAAASUVORK5CYII=",
      },
    },
    permission: {
      userManagement: {
        type: Boolean,
        default: false,
      },
      hostelManagement: {
        type: Boolean,
        default: false,
      },
      kycManagement: {
        type: Boolean,
        default: false,
      },
      contentManagement: {
        type: Boolean,
        default: false,
      },
      feedbackManagement: { 
        type: Boolean,
        default: false,
      },
      accountManagement: {
        type: Boolean,
        default: false,
      },
    },
    adharCardNo: {
      type: Number,
      default: null,
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
    // lastLogin: {
    //   type: String,
    //   default: new Date(),
    // },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
