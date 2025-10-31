const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// Auth Middleware

// ==================================================================

exports.auth = async (req, res, next) => {
  try {
    // 1. Extract Token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");
    //2. Check token is missing
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token is missing" });
    }
    // 3. Verify the token
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decode); // Debugging line
        req.user = decode;
        next();
    } catch (err) {
      console.error(err);
      return res
        .status(401)
        .json({ success: false, message: "Token is invalid" });
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: "Something went wrong, while validating token please try again later." });
  }
};

// ==================================================================

// isStudent

// ==================================================================

exports.isStudent = async (req, res, next) => {
  try{
    if(req.User.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for Students only",
      });
    }
    next();
  }
  catch(err){
    return res.status(500).json({
      success: false,
      message: "Error in isStudent Middleware, Please try again...",
    });
  }
}

// ==================================================================

// isInstructor
// ==================================================================

exports.isInstructor = async (req, res, next) => {
  try{
    if(req.User.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for Instructors only",
      });
    }
    next();
  }
  catch(err){
    return res.status(500).json({
      success: false,
      message: "Error in isInstructor Middleware, Please try again...",
    });
  }
}

// ==================================================================