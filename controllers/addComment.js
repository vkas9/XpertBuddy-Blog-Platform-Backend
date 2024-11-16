const { default: mongoose } = require("mongoose");
const comments = require("../models/comments.model");
const blogModel = require("../models/blog.model");
exports.addComment = async (req, res) => {
  try {
    const { comment, blogId } = req.body;
    const { _id } = req.user;
    const blogObjectId = new mongoose.Types.ObjectId(blogId);
    const fetchedComment = await comments.create({
      text: comment,
      // commentedUser:_id,
      commentedBlog: blogObjectId,
    });

    await blogModel.findByIdAndUpdate(
      {
        _id: blogObjectId,
      },
      { $push: { comments: fetchedComment._id } }
    );
    return res.status(201).json({
      success: true,
      message: "Successfully comment Added",
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Something went wrong while creating Comment",
    });
  }
};
