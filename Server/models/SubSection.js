import e from 'express';

const mongoose = require('mongoose');
const SubSectionSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true,
        trim : true
    },
    timeDuration : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    videoUrl : {
        type : String,
        required : true
    }

})

exports.SubSection = mongoose.model('SubSection', SubSectionSchema);