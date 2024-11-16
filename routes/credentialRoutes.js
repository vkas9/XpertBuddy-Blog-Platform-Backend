const express = require("express");

const router = express.Router();
const {
  login,
  signup,
  checkOTP,
  updateProfilePicture,
  updateProfileDetails,
} = require("../controllers/Credential");
const { auth } = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);
router.post("/checkotp", checkOTP);
router.post("/updateprofilepicture", auth, updateProfilePicture);
router.post("/updateprofiledetails", auth, updateProfileDetails);

module.exports = router;
