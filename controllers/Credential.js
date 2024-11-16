const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const profileModel = require("../models/profile.model");
const optgenerator = require("otp-generator");
const OTP = require("../models/OTP");
const { uploadDigital } = require("../utils/file_uploader");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs").promises;
require("dotenv").config();
exports.signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "Already User Exist",
      });
    }

    const userData = await profileModel.create({
      gender: null,
      contact_number: null,
      user_profile_image: `https://api.dicebear.com/8.x/pixel-art/svg?seed=${first_name}`,
    });
    const hashedPassword = await bcrypt.hash(password, 10);

    const userProfile = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      profile: userData._id,
    });
    const populatedUserProfile = await profileModel.findById(userData._id);
    const userToken = jwt.sign(
      {
        email: userProfile.email,
        _id: userProfile._id,
      },
      process.env.TOKEN_SECRET
    );

    const userWithoutPassword = userProfile.toObject();
    const tempData = {
      ...userWithoutPassword,
      profile: populatedUserProfile,
    };
    delete tempData.password;
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
    res.status(201).cookie("usr", userToken, options).json({
      success: true,
      message: "Successfully User Created",
      userDetail: tempData,
      token: userToken,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating new user",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const UserExist = await User.findOne({ email })
      .populate("profile")
      .populate({
        path: "blogs",
        populate: [{ path: "likes" }, { path: "comments" }],
      })
      .exec();

    if (!UserExist) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }
    if (!(await bcrypt.compare(password, UserExist.password))) {
      return res.status(403).json({
        success: false,
        message: "Incorrect Password",
      });
    }
    const userToken = jwt.sign(
      {
        email: UserExist.email,
        _id: UserExist._id,
      },
      process.env.TOKEN_SECRET
    );
    const userWithoutPassword = UserExist.toObject();
    delete userWithoutPassword.password;
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
    res.status(200).cookie("usr", userToken, options).json({
      success: true,
      message: "Successfully Logged in",
      userDetail: userWithoutPassword,
      token: userToken,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(403).json({
      success: false,
      message: "Something went wrong while logging",
    });
  }
};

exports.checkOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Already User registered with this Email",
      });
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

exports.updateProfilePicture = async (req, res) => {
  try {
    const photo = req.files?.profilePicture;
    const { _id } = req.user;

    const tempDir = path.join(__dirname, "..", "public", "temp");
    const tempCompressedPath = path.join(
      tempDir,
      `compressed_${Date.now()}.jpeg`
    );
    await fs.mkdir(tempDir, { recursive: true });
    await sharp(photo.tempFilePath)
      .resize(1080, 1080, { fit: sharp.fit.inside, withoutEnlargement: true })
      .toFormat("jpeg", { quality: 100 })
      .toFile(tempCompressedPath);

    const image = await uploadDigital(tempCompressedPath);

    const userD = await User.findById(_id).select("profile");
    const updateProfile = await profileModel.findByIdAndUpdate(
      { _id: userD.profile },
      { user_profile_image: image.publicUrl },
      { new: true }
    );

    await fs.unlink(tempCompressedPath);

    res.status(200).json({
      status: "true",
      message: "Successfully updated Profile image",
      data: updateProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.updateProfileDetails = async (req, res) => {
  try {
    const { contactNumber, gender } = req.body;
    const { _id } = req.user;
    const userDetail = await User.findById(_id).select("profile");
    const profileDetail = await profileModel.findById({
      _id: userDetail.profile,
    });

    if (contactNumber !== "") {
      profileDetail.contact_number = contactNumber;
    }

    if (gender !== "") {
      profileDetail.gender = gender;
    }
    await profileDetail.save();

    return res.status(200).json({
      success: true,
      message: "successfully Updatd User Profile Details",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating Profile",
    });
  }
};
