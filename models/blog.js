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
    numLikes: Number,
    created: {type: Date, default: Date.now},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
    }]
});

module.exports = mongoose.model("Blog", blogSchema);