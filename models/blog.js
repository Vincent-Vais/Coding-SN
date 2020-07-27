const mongoose = require("mongoose");

blogSchema = new mongoose.Schema({
    authorUsername: String,
    authorImage: { 
        data: Buffer, 
        contentType: String 
    },
    authorFirstName: String,
    authorLastName: String,
    title: String,
    body: String,
    image: String,
    created: {type: Date, default: Date.now} 
});

module.exports = mongoose.model("Blog", blogSchema);