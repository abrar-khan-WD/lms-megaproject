const mongoose = require('mongoose');
const SubSectionSchema = new mongoose.Schema({
    sectionName: {
        type : String,
        required : true,
        trim : true
    },
    subSections : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'SubSection',
        required : true
    }

})

exports.Section = mongoose.model('Section', SectionSchema);