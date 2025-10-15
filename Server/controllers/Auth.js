// Importing necessary modules and models
// send OTP
const user = require("../models/User");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const otp = require("../models/Otp");
require("dotenv").config();


// ===================================================================

exports.SendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if the user already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(otp);

    // Check unique OTP is generated
    let result = await Otp.findOne({ otp });
    if (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }

    const otpPayload = { email, otp };
    // Save the OTP to the database
    const otpBody = await Otp.create(otpPayload);
    console.log(otpBody);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: otp,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error in sending OTP",
    });
  }
};

// ===================================================================

// Signup

exports.signUp = async (req, res) => {
  try {
    // Data Fetch from Request Body
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      password,
      confirmPassword,
      accountType,
      Image,
      otp,
    } = req.body;
    // Validation Fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !contactNumber ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !Image ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    // Password Match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match, Please try again...",
      });
    }
    // Check if user already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // Find most recent OTP
    const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });
    // VALIDATE otp
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found, Please try again...",
      });
    }
    // Match the OTP
    if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP, Please try again...",
      });
    }
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Store User in Database
    const additionalDetails = await profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await user.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      accountType,
      additionalDetails: additionalDetails._id,
      Image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    console.log(user);
    // Return Response
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "User registration failed, Please try again...",
    });
  }
};

// ==================================================================

// Login

exports.logIn = async (req, res) => {
  try {
    //Fetch Data from Request Body
    const { email, password } = req.body;

    // Validate Data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    // Check if user exists
    const existingUser = await user
      .findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found, Please sign up...",
      });
    }
    // Match Password
    if (await bcrypt.compare(password, existingUser.password)) {
      // payload
      const payload = {
        email: existingUser.email,
        id: existingUser._id,
        accountType: existingUser.accountType,
      };
      // generate JWT Token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      user.token = token;
      user.password = undefined;

      // Store in Cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).json({
        success: true,
        user: existingUser,
        token,
        message: "User logged in successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid Password, Please try again...",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error in Login, Please try again...",
    });
  }
};

// ==================================================================

// Change Password

exports.changePassword = async(req, res) => {
    try{
        // Fetch Data from Request Body
        const {email, oldPassword, newPassword, confirmPassword} = req.body;
        // Validate Data
        if(!email || !oldPassword || !newPassword || !confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Please fill all fields",
            });
        }
        //Check if user exists
        const existingUser = await user.findOne({email});
        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: "User not found, Please sign up...",
            });
        }
        // Match Old password
        if(await bcrypt.compare(oldPassword, existingUser.password)){
            // Match New Password and Confirm Password
            if(newPassword !== confirmPassword){
                return res.status(400).json({
                    success: false,
                    message: "New Password and Confirm Password do not match",
                });
            }
            // Hash New Password
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            existingUser.password = hashedNewPassword;
          await existingUser.save();
          // send email notification
          const mailSender = await sendEmail(
              existingUser.email,
              "Password Changed Successfully || Codegyaani",
              "Your password has been changed successfully. If you did not initiate this change, please contact our support team immediately."
          );
          console.log(mailSender);
          return res.status(200).json({
              success: true,
              message: "Password changed successfully",
          });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid Old Password, Please try again...",
            });
        }
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in Changing Password, Please try again...",
        });
    }
};

// ==================================================================

