const blogModel = require("../models/blog.model");
exports.getAllBlogs = async (req, res) => {
  try {
    const allBlog = await blogModel
      .find({})
      .populate("profileDetail")
      .populate("comments");
    res.status(200).json({
      success: true,
      message: "Successfully Fetched all Blogs ",
      allBlog,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Something went wrong while fetching Blogs",
    });
  }
};

exports.getSingleBlog = async (req, res) => {
  try {
    const { blogId } = req.query;
    if (!blogId) {
      return res
        .status(400)
        .json({ success: false, message: "blogId is required" });
    }

    console.log("blog_id", blogId);

    // fetch the blog from the database
    const blog = await blogModel
      .findById(blogId)
      .populate("profileDetail")
      .populate("comments"); // Replace 'Blog' with your actual model
    console.log("blog", blog);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Return the blog details as the response
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
