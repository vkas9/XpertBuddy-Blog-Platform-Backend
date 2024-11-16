const blogModel = require("../models/blog.model");
const User = require("../models/user.model");
const path = require("path");
const fs = require("fs").promises;
const sharp = require("sharp");
const { uploadDigital } = require("../utils/file_uploader");

exports.createNewBlog = async (req, res) => {
  try {
    const { title, blog_context, category, tags } = req.body;
    const image = req.files?.blog_image;
    const { _id } = req.user;
    let uploadThumbnail;

    if (image) {
      const tempDir = path.join(__dirname, "..", "public", "temp");
      const tempCompressedPath = path.join(
        tempDir,
        `compressed_${Date.now()}.jpeg`
      );

      // Ensure temp directory exists
      await fs.mkdir(tempDir, { recursive: true });

      // Compress and save the image
      await sharp(image.tempFilePath)
        .resize(1024, 1024, { fit: sharp.fit.inside, withoutEnlargement: true })
        .toFormat("jpeg", { quality: 100 })
        .toFile(tempCompressedPath);

      // Upload the compressed image
      uploadThumbnail = await uploadDigital(tempCompressedPath);

      // Delete the temporary compressed image
      await fs.unlink(tempCompressedPath);
    }

    const user1 = await User.findById(_id).select(
      "first_name last_name profile"
    );
    const userName = `${user1.first_name} ${user1.last_name}`;

    // Create a new blog in the database
    const blogDetail = await blogModel.create({
      title,
      blog_context,
      blog_image: uploadThumbnail ? uploadThumbnail.publicUrl : null,
      ownerDetails: userName,
      profileDetail: user1.profile,
      category,
      tags,
    });

    // Update the user's blogs array
    await User.findByIdAndUpdate(_id, {
      $push: { blogs: blogDetail._id },
    });

    res.status(201).json({
      success: true,
      message: "Successfully Blog Created",
      blogDetail,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Something went wrong while Bloging",
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { blogId } = req.query;
    console.log("blogId",blogId)
    const { title, text, category, tags } = req.body;
    const image = req.files?.blog_image;
    let uploadThumbnail;

    // If a new image is provided, handle the image upload
    if (image) {
      const tempDir = path.join(__dirname, "..", "public", "temp");
      const tempCompressedPath = path.join(
        tempDir,
        `compressed_${Date.now()}.jpeg`
      );

      await fs.mkdir(tempDir, { recursive: true });

      // Compress and save the image
      await sharp(image.tempFilePath)
        .resize(1024, 1024, { fit: sharp.fit.inside, withoutEnlargement: true })
        .toFormat("jpeg", { quality: 100 })
        .toFile(tempCompressedPath);

      // Upload the compressed image
      uploadThumbnail = await uploadDigital(tempCompressedPath);

      // Delete the temporary compressed image
      await fs.unlink(tempCompressedPath);
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (text) updateFields.text = text;
    if (category) updateFields.category = category;
    if (tags) updateFields.tags = tags;
    if (uploadThumbnail) updateFields.blog_image = uploadThumbnail.publicUrl;

    // Update the blog in the database with provided fields
    const updatedBlog = await blogModel.findByIdAndUpdate(
      blogId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      updatedBlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the blog",
    });
  }
};
