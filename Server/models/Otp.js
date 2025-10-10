const mongoose = require("mongoose");
const mailSender = require("../utils/mailsender");
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 minutes
  },
});

// Verification email function before saving in the database
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Send OTP for Verification || Codegyaani",
      otp
    );
    console.log(mailResponse);
  } catch (err) {
    console.log(err);
    throw new Error("Mail sending failed");
  }
}

// Pre-save middleware to send OTP email before saving the document
otpSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});



module.exports = mongoose.model("Otp", otpSchema);
