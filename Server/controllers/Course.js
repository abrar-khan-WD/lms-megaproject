const Course = require('../models/Course');
const User = require('../models/User');
const {uploadImagetoCloudinary} = require('../utils/imageUpload');
const Category = require('../models/Category');

// ==================================================================

// Create Course

exports.createCourse = async (req, res) => {
    try{
        // Fetch Data from request body
        const {courseName, courseDescription, whatYouWillLearn, price, category} = req.body;

        // Fetch Thumbnail Image from req file
        const thumbnail = req.file.thumbnail;

        // Fields Validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
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

        // Category Validation
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
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
            category: categoryDetails._id
        })

        // Add New Course to User Schema
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {courses: newCourse._id}
            },
            {new: true}
        );

        // Add Course Entry to Category Schema
        await Category.findByIdAndUpdate(
            {_id : categoryDetails._id},
            {
                $push : {course: newCourse._id}
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