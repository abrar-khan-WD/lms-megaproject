// Section Controller
const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

// Create a New Section

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    // Validate required fields

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section name and Course ID are required",
      });
    }

    // Create new section
    const newSection = await Section.create({
      sectionName,
    });

    // Add Section ot the Course

    const updatedCourse = await Course.findByIdandUpdate(
      courseId,
      {
        // Populate the courseContent array with the new section
        $push: { courseContent: newSection._id }.populate(
          "courseContent",
          sectionName,
          SubSection
        ),
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Section created and added to course successfully",
      course: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section",
      error: error.message,
    });
  }
};

// Update a Section

exports.updateSection = async (req, res) => {
  try {
    // Data Fetch from request body
    const { sectionName, sectionId } = req.body;

    // Check Validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section Name and Section ID are required",
      });
    }

    // Update Section in DB
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // Response
    return res.status(200).json({
        success: true,  
        message: "Section updated successfully",
        section: updatedSection
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section, Please try again",
      error: error.message,
    });
  }
};



// ===================================================================

// Delete a Section

exports.deleteSection = async(req, res) => {
    try{
        // Fetch from request paaram
        const {sectionId} = req.params;
        
        // Check Validation
        if(!sectionId){
            return res.status(400).json({
                success: false,
                message: "Section ID is required"
            });
        }

        // Delete Section From DB
        await Section.findByIdAndDelete(sectionId);

        // Todo - Do we need to delete from course schema also?

        // Response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully"
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, Please try again",
            error: error.message
        });
    }
}