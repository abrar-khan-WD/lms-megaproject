// Tag Controller
const Tag = require('../models/Tag');

// Create a new tag
exports.createTag = async (req, res) => {
    try{
        // Fetch tag data from request body
        const {name, description} = req.body;

        // Check Validation
        if(!name || !description){
            return res.status(400).json({ message: 'Name and Description are required' });
        }

        // Tag Entry in Database
        const tagDetails = await Tag.create({
            name : name,
            description : description
        })

        // Response
        res.status(201).json({ message: 'Tag Created Successfully', tag: tagDetails });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

// ===============================================
// Get all tags

exports.getAllTags = async(req, res) => {
    try{
        // Fetch all tags from database
        const tags = await Tag.find({}, {name: true, description: true});

        // Response
        res.status(200).json({ message: 'Tags Retrieved Successfully', tags });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}











