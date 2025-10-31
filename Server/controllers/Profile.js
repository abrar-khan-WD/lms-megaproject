exports.updateProfile = async (req, res) => {
  try {
    //  Fetch Data from request body
    const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;

    // 2️⃣ Get User ID from req.user (set by auth middleware)
    const id = req.user.id;

    // 3️⃣ Validation
    if (!gender || !dateOfBirth || !about || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 4️⃣ Find the user and profile
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // 5️⃣ Update fields
    profileDetails.gender = gender;
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;

    // 6️⃣ Save changes
    await profileDetails.save();

    // 7️⃣ Response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Error updating profile",
    });
  }
};



// =============================================================
// Delete Account 

exports.deleteAccount = async(req, res) => {
  try{
    // Get ID from req.user
    const id = req.user.id;

    // Find the User and Validate
    const userDetails = await User.findById(id);

    if(!userDetails){
      return res.status(400).json({
        success : false,
        message : "User Not Found"
      })
    }

    // TODO : - Unenroll user from the courses

    // Delete Profile
    await Profile.findByIdAndDelete({
      _id : userDetails.additionalDetails
    })

    // Delete User
    await User.findByIdAndDelete({
      _id : id
    })

    

    // Response
    return res.status(200).json({
      success : true,
      message : "Account Deleted Successfully"
    })
  }
  catch(err){
    console.log(err)
     return res.status(500).json({
      success: false,
      message: err.message || "Error deleting account",
    })
  }
}


// =============================================================
// Get User Details

exports.getUserDetails = async(req, res) => {
  try{
    // Get ID from req.user
    const id = req.user.id;

    // Fetch the User and Validate
    const userDetails = await User.findById(id).populate("additionalDetails").exec();
    if(!userDetails){
      return res.status(400).json({
        success : false,
        message : "User Not Found"
      })
    }
      // Return Response
      return res.status(200).json({
        success : true,
        message : "User Details Fetched Successfully",
        userDetails
      })
    }
  catch(err){
    console.log(err);
    return res.status(500).json({
      success : false,
      message: err.message || "Error Fetching User Details"
    })
  }
}
