
const User = require("../models/user.model");
const optgenerator = require("otp-generator");
const OTP=require("../models/OTP");
const bcrypt=require("bcrypt")
const sendMail = require("../utils/mail_sender");
exports.forgotPasswordOTP = async (req, res) => {
    try {
        
      const { email } = req.body;

      const isUserExist=await User.findOne({email:email});
      if(!isUserExist){
        return res.status(404).json({
          success:false,
          message:"User not Registered"
        })
      }
      const generatedOtp = optgenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      await OTP.create({ email, OTP: generatedOtp });
  
      res.status(200).json({
        success: true,
        message: "Successfully OTP send",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong while OTP Generating",
      });
    }
  };


  exports.verifyForgotPasswordOTP = async (req, res) => {
    try {
      const { otp, email } = req.body;
  
  
      const recentOtp = await OTP.find({ email })
        .sort({ createdAt: -1 })
        .limit(1);
    
  
      if (recentOtp.length === 0 || recentOtp[0] === 0) {
        return res.status(400).json({
          success: false,
          message: "OTP Expired",
        });
      } else if (recentOtp[0].OTP !== otp) {
        return res.status(400).json({
          success: false,
          message: "OTP not Matching",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Email Verified!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to Verify OTP",
      });
    }
  };


  exports.resetPassword = async (req, res) => {
    try {
      const { password, ConfirmPassword, email } = req.body;
      if (!email || !password || !ConfirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Email, password, and confirm password are required",
        });
      }
      const registredUser = await User.findOne({ email: email });
  
      if (!registredUser) {
        return res.status(400).json({
          success: false,
          message: "User Not Found!",
        });
      }
      if (password !== ConfirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Password do not matching!",
        });
      }
  
      const newPassHash = await bcrypt.hash(password, 10);
  
   await User.updateOne(
        { email: email },
        {$set:{password: newPassHash}}
       
        
      );
  
      await sendMail(email, "Password Reset ", "Password Reset successfully");
  
      return res.status(200).json({
        success: true,
        message: "Password successfully Reset!",
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while changing password",
      });
    }
  };