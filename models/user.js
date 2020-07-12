const mongoose              = require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose");

userSchema = new mongoose.Schema({
    name: String,
    img: { 
        data: Buffer, 
        contentType: String 
    },
    username: String,
    password: String,
    myBlogs: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog"
    }]
}); 

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);