const app = require("express");
const {
  forgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetPassword,
} = require("../controllers/forgotPassword");
const router = app.Router();
router.post("/forgotPassword", forgotPasswordOTP);

router.post("/verifyForgotPasswordOTP", verifyForgotPasswordOTP);
router.post("/resetPassword", resetPassword);

module.exports = router;
