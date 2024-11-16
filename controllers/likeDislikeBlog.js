const blogModel = require("../models/blog.model");
exports.likeDislikeBlog = async (req, res) => {
  try {
    const { blog_id, isAlreadyLike } = req.body;
    const { _id } = req.user;
    if (isAlreadyLike) {
      await blogModel.findByIdAndUpdate(
        { _id: blog_id },
        { $pull: { likes: _id } }
      );
      res.status(200).json({
        success: true,
        message: "Successfully unliked the blog",
      });
    } else {
      await blogModel.findByIdAndUpdate(
        { _id: blog_id },
        {
          $push: { likes: _id },
        }
      );
      res.status(200).json({
        success: true,
        message: "Successfully liked the blog",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Something went wrong liking Blog",
    });
  }
};
