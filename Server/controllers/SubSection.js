const subSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImagetoCloudinary } = require("../utils/imageUpload");
// DOTENV Config
require("dotenv").config();

// Create a new SubSection
exports.createSubSection = async (req, res) => {
  try {
    // Fetch Data from Request Body
    const { sectionId, title, description, timeDuration, videoUrl } = req.body;

    // Extract File/Video
    const video = req.files.videoFile;

    // Validation
    if (!sectionId || !title || !description || !timeDuration || !videoUrl) {
      return res.status(400).json({
        message: "All fields are required",
        error: error.message,
      });
    }

    // Upload Video to Cloudinary
    const uploadDetails = await uploadImagetoCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    console.log("Video uploaded to Cloudinary:", uploadDetails);

    // Create Subsection in DB
    const subSectionDetails = await subSection.create({
      title: title,
      description: description,
      timeDuration: timeDuration,
      videoUrl: uploadDetails.secure_url,
    });

    // Push SubSection to Section

    const updatedSection = await Section.findByIDAndUpdate(
      { _id: sectionId },
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    // Return Response
    res.status(201).json({
      success: true,
      message: "SubSection created successfully",
      data: subSectionDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create SubSection, Please try again",
      error: error.message,
    });
  }
};


// ===================================================================
// Update SubSection

exports.updateSubSection = async(req,res) => {
    try{
        // Fetch Data from request body
        const{sectionId, subSectionId, title, description, timeDuration, videoUrl} = req.body;

        // Check Validation
        if(!sectionId || !subSectionId || !title || !description || !timeDuration || !videoUrl){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Update Section in DB
        const updatedSubSection = await subSection.findByIDAndUpdate({
            sectionId: sectionId,
            _id: subSectionId
        }, {
            title: title,
            description: description,
            timeDuration: timeDuration,
            videoUrl: videoUrl
        }, {new: true});

        // Response
        return res.status(200).json({
            success: true,
            message: "SubSection updated successfully",
            data: updatedSubSection
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
// Delete SubSection
exports.deleteSubSection = async(req,res) => {
    try{
        // Fetch Data from request body
        const{sectionId, subSectionId} = req.body;

        // Check Validation
        if(!sectionId || !subSectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Delete SubSection from DB
        const deletedSubSection = await subSection.findByIdAndDelete({
            sectionId: sectionId,
            _id: subSectionId
        });

        // Response
        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            data: deletedSubSection
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
    