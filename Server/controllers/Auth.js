// Importing necessary modules and models
// send OTP
const user = require("../models/User");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const profile = require("../models/Profile");
const bcrypt = require("bcrypt");

// ===================================================================

exports.SendOTP = async(req,res) => {
    try{
        const {email} = req.body;
        // Check if the user already exists
        const existingUser = await user.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        // Generate a 6-digit OTP
        const otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
        console.log(otp);

        // Check unique OTP is generated
        let  result = await Otp.findOne({otp});
        if(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })  
        }


        const otpPayload = {email, otp};
        // Save the OTP to the database
        const otpBody = await Otp.create(otpPayload);
        console.log(otpBody);
        return res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp:otp
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Error in sending OTP"
        })
    }
}


// ===================================================================

// Signup

exports.signUp = async(req, res) => {
    try{
        // Data Fetch from Request Body
        const {firstName, lastName, email, contactNumber, password, confirmPassword, accountType, Image, otp} = req.body;
        // Validation Fields
        if(!firstName || !lastName || !email || !contactNumber || !password || !confirmPassword || !accountType || !Image || !otp){
            return res.status(400).json({
                success:false,
                message:"Please fill all fields"
            })
        }
        // Password Match
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm Password do not match, Please try again..."
            })
        }
        // Check if user already exists
        const existingUser = await user.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        // Find most recent OTP
        const recentOtp = await Otp.findOne({email}).sort({createdAt:-1});
        // VALIDATE otp
        if(!recentOtp){
            return res.status(400).json({
                success:false,
                message:"OTP not found, Please try again..."
            })
        }
        // Match the OTP
        if(recentOtp.otp !== otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP, Please try again..."
            })
        }
        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Store User in Database
        const additionalDetails = await profile.create({
            gender : null,
            dateOfBirth : null,
            about : null,
            contactNumber : null
        });
        
        
        const user = await user.create({
            firstName,
            lastName,   
            email,
            contactNumber,
            password:hashedPassword,
            confirmPassword:hashedPassword,
            accountType,
            additionalDetails:additionalDetails._id,
            Image:`https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}`
        })
        console.log(user);
        // Return Response
        return res.status(200).json({
            success:true,
            message:"User registered successfully",
            user
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User registration failed, Please try again..."
        })
    }
}


// ==================================================================

// Login

exports.logIn = async(req, res) => {
    try{
        // Fetch Data from Request Body
        const {email, password} = req.body;

        // Check Validation of fields
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all fields"
            })
        }
        // Check if user exists
        const existingUser = await user.findOne({email});
        if(!existingUser){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            })
        }



        // Generate JWT Token after password is matched




        // Store in cookies and return res




        // Return Response
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Error in Login, Please try again..."
        })
    }
}








// ==================================================================

// Change Password