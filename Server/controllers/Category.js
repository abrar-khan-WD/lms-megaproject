// Category Controller
const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
    try{
        // Fetch category data from request body
        const {name, description} = req.body;

        // Check Validation
        if(!name || !description){
            return res.status(400).json({ message: 'Name and Description are required' });
        }

        // Category Entry in Database
        const categoryDetails = await Category.create({
            name : name,
            description : description
        });

        // Response
        res.status(201).json({ message: 'Category Created Successfully', Category: categoryDetails });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

// ===============================================
// Get all categories

exports.getAllCategory = async(req, res) => {
    try{
        // Fetch all categories from database
        const category = await Tag.find({}, {name: true, description: true});

        // Response
        res.status(200).json({ message: 'Categories Retrieved Successfully', Category });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}











