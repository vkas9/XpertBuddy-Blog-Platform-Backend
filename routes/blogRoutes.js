const express = require("express");
const router = express.Router();

const { createNewBlog, updateBlog } = require("../controllers/createBlog");
const { likeDislikeBlog } = require("../controllers/likeDislikeBlog");
const { auth } = require("../middlewares/auth");
const { getAllBlogs, getSingleBlog } = require("../controllers/getAllBlogs");
const { addComment } = require("../controllers/addComment");

router.post("/addblog", auth, createNewBlog);
router.post("/like", auth, likeDislikeBlog);
router.get("/allblog", getAllBlogs);
router.post("/comments", auth, addComment);
router.put("/updateblog", auth, updateBlog);
router.get("/", getSingleBlog);

module.exports = router;
