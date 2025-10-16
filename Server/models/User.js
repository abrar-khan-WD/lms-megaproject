// Import Mongoose library
const mongoose = require("mongoose");

// Define the User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Student", "Instructor", "Admin"],
    required: true,
  },
  additionalDetails: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  courses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Course",
  },
  Image: {
    type: String,
    required: true,
  },
  token : {
    type: String,
    default: null,
  },
  resetPasswordToken : {
    type: String,
    default: null,
  },
  courseProgress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseProgress",
  },
});

exports.User = mongoose.model("User", userSchema);
