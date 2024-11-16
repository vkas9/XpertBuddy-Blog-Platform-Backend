const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    // commentedUser:{
    //      type:mongoose.Schema.Types.ObjectId,
    //     ref:"User"
    // },
    // commentedBlog:{
    //      type:mongoose.Schema.Types.ObjectId,
    //     ref:"blogModel"

    // }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comments", commentSchema);
