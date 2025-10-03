const mongoose = require("mongoose");
const RatingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
});

exports.RatingAndReview = mongoose.model(
  "RatingAndReview",
  RatingAndReviewSchema
);
