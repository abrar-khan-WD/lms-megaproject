const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum : ["Male", "Female", "Other"],
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    about: {
        type : String,
        required: true,
        trim: true
    },
    contactNumber : {
        type: String,
        required: true,
        trim: true
    }
})

exports.Profile = mongoose.model('Profile', profileSchema);
