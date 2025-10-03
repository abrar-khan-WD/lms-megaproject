const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      unique: true,
    },
    courseDescription: {
      type: String,
      required: true,
    },
    Instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    whatyouwilllearn: {
      type: [String],
      required: true,
    },
    courseContent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseContent",
      required: true,
    },
    ratingsandReviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    studentEnrolled: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    languages: {
      type: [String],
      enum: [
        "English",
        "Hindi",
        "Spanish",
        "French",
        "German",
        "Chinese",
        "Japanese",
        "Russian",
        "Portuguese",
        "Arabic",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

exports.Course = mongoose.model("Course", courseSchema);
