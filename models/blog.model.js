const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    blog_context: {
      type: String,
    },
    blog_image: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    category: {
      type: String,
    },
    tags: [{ type: String }],
    ownerDetails: {
      type: String,
      required: true,
    },
    profileDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profileModel",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("blogModel", blogSchema);
