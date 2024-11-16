const mongoose = require("mongoose");
const mailSender = require("../utils/mail_sender");

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "3m",
    required: true,
  },
  OTP: {
    type: String,
    required: true,
  }
});

const sendMail = async (email, otp) => {
  try {
    const mail = await mailSender(email, " MentorMee Verification Email", `Your OTP is: ${otp}`);

  } catch (error) {
    console.log("Something went wrong while sending mail");
    console.log(error);
  }
};

OtpSchema.pre("save", async function(next) {
  
  await sendMail(this.email, this.OTP);
  next();
});

module.exports = mongoose.model("OTP", OtpSchema);
