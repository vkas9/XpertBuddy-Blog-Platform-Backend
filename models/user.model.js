const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profileModel",
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogModel",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
