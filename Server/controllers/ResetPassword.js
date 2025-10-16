//  Require the dependency model
const user = require("../models/user");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");

// Reset Password token generation and sending email
// ===================================================================
exports.resetPassword = async(req, res) => {
    try{
        // Get Email from the request body
        const {email} = req.body;
        // Check if the user is registered or not with this email and add validation
        const user = await user.findOne({email: email});
        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found with this email",
            });
        }
        // Generate a unique token for password reset
        const token = crypto.randomUUID();
        // Update the user by adding the token and its expiry time (1 hour)
        const updateDetails = await user.findOneAndUpdate(
            {email: email},
            {
                token: token,
                resetPasswordToken: 5*60*1000 + Date.now(), // 5 minutes
            },
            {new: true} // To return the updated document
        );

        // Create a password reset URL containing the token
        const url = `http://localhost:3000/resetPassword/${token}`;
        
        // Send the password reset email to the user

        await mailSender(email, "Reset Your Password", `Click on the link to reset your password: ${url} . This link is valid for 5 minutes.`);
        // Return a response to the frontend about the success/failure of the email sending 
        return res.status(200).json({
            success: true,
            message: "Password reset email sent successfully.",
        });
      
    }
    catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong in sending password reset email."
        });
    }
}


// Reset Password
// ===================================================================

exports.updatePassword = async(req, res) => {
    try{
        // Get data from the request body
        const {email, token, password, confirmPassword} = req.body;

        // Check Validation 
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "New Password and Confirm Password do not match.",
            });
        }

        if(password.length < 6){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long.",
            });
        }

        // Get the user Details from the database using the token
        const user = await user.findOne({
            token: token,
        })

        
        // If no entry then invlaid token

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Invalid token.",
            });
        }

        // Check for token expiry
        if(user.resetPasswordToken < Date.now()){
            return res.status(400).json({
                success: false,
                message: "Token has expired. Please try again.",
            });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //update the password in the database and remove the token and its expiry time
        await user.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
           {new: true} // To return the updated document

        );

        // send a success response to the frontend
        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });
    }
    
    catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong in updating the password."
        });
    }
}