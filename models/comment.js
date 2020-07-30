const mongoose = require("mongoose");

commentSchema = new mongoose.Schema({
    author: [{
        type: mongoose.Schema.Types.ObjectId,
		ref: "User"
    }],
    body: String,
    underBlog: [{
        type: mongoose.Schema.Types.ObjectId,
		ref: "Blog"
    }],
    created: {type: Date, default: Date.now},
    numOfLikes: Number 
});

module.exports = mongoose.model("Comment", commentSchema);