// Import Mongoose
const mongoose = require('mongoose');
// Load env variables from .env file
require('dotenv').config();

// Connect to MongoDB
exports.connectDB = async() => {
    try{
        await mongoose.connect(process.env.MongoDB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("MongoDB connected successfully");
        });
    }
    catch(err){
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit process with failure
    }
}
// Note: Make sure to create a .env file with your MongoDB_URL
// Example .env content:
// MongoDB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority