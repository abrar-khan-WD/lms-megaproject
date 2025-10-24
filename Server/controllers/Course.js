const Course = require('../models/Course');
const User = require('../models/User');
const Tag = require('../models/Tag');
const {uploadImagetoCloudinary} = require('../utils/imageUpload');

// ==================================================================

// Create Course

exports.createCourse = async (req, res) => {
    try{
        // Fetch Data from request body
        const {courseName, courseDescription, whatYouWillLearn, price,tags} = req.body;

        // Fetch Thumbnail Image from req file
        const thumbnail = req.file.thumbnail;

        // Fields Validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tags || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Get Instructor id from req.user
        // Todo check if the user id and instructor id are same
        const userId = req.existingUserId;
        const instructorDetails = await User.findById(userId); 

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found"
            });
        }

        // Tag Validation
        const tagDetails = await Tag.findById(tags);
        if(!tagDetails) {
            return res.status(404).json({
                success: false,
                message: "Tag not found"
            });
        }

        // Upload thumbnail to cloudinary
        const thumbnailImage = await uploadImagetoCloudinary(thumbnail, process.env.FOLDER_NAME);

        // Create Course in DB
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            thumbnail: thumbnailImage.secure_url,
            instructor : instructorDetails._id,
            tags: tagDetails._id
        })

        // Add New Course to User Schema
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {courses: newCourse._id}
            },
            {new: true}
        );

        // Add Course Entry to Tag Schema
        await Tag.findByIdAndUpdate(
            {_id : tagDetails._id},
            {
                $push : {courses: newCourse._id}
            },
            {new: true}
        )

        // Response
        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            course: newCourse
        });

    } 
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// ===================================================================

// Get All Courses


exports.getAllCourses = async (req, res) => {
    try{
        const allCourses = await Course.find({},{courseName:true, courseDescription:true, price:true, thumbnail:true, instructor:true, ratingsAndReviews:true, studentEnrolled:true}).populate("instructor").exec();
        return res.status(200).json({
            success: true,
            message: "All Courses fetched successfully",
            courses: allCourses
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}