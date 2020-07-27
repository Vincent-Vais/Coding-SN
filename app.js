// SETING EVERYTHING UP
const express = require("express"),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  expressSanitizer = require("express-sanitizer"),
	  methodOverride = require("method-override"),
	  passport       = require("passport"),
	  LocalStrategy  = require("passport-local"),
	  User = require("./models/user"),
	  Blog = require("./models/blog");

var fs = require('fs'); 
var path = require('path'); 
var multer = require('multer'); 

var storage = multer.diskStorage({ 
	destination: (req, file, cb) => { 
		cb(null, 'uploads') 
	}, 
	filename: (req, file, cb) => { 
		cb(null, file.fieldname + '-' + Date.now()) 
	} 
}); 

var upload = multer({ storage: storage }); 

mongoose.connect("mongodb://localhost:27017/blog_camp", {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

app.use(require("express-session")({
	secret: "code",
	resave: false,
	saveUninitialized: false
}));

app.use(function(req, res, next){
	if(req.session.passport){
		User.findOne({username: req.session.passport.user}, (err, foundUser)=>{
			if(err){
				console.log(err);
				next();
			}
			res.locals.user = foundUser;
			next();
		});
	}
	else{
		res.locals.user = undefined;
		next();
	}
});

const isLoggedIn = (req, res, next) => {
	if(req.session.passport && req.user.username === req.session.passport.user){
		next();
	}else{res.redirect("/login");}	
}

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// User.create({
// 	name: "Vincent",
// 	username: "vince_vais",
//     email: "vincent@email.com",
//     password: "password"}, function(err, createdUser){
// 		if(err){
// 			console.log(err);
// 			return
// 		}
// 		Blog.create({
// 			author: createdUser.name,
//     		title: "My First Blog",
// 			body: "LOREM ISPUM SOMETHING DOLOR",
// 			image: "IMAGE",
// 		}, function(err, createdBlog){
// 			if(err){
// 				console.log(err);
// 				return
// 			}
// 			createdUser.myBlogs.push(createdBlog);
// 			createdUser.save();
// 		})
// 	}
// );

// RESTFULL ROUTES
app.get("/", function(req, res){
	res.redirect("/blogs");
})

// ######################## BLOG PAGE #########################

app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("Error! ", err);
		}else{
			for (let blog of blogs){
				User.find({'myBlogs' : mongoose.Types.ObjectId(`${blog._id}`)}, (err, foundUser) => {
					if(err){
						console.log(err);
					}else{
						blog.authorUsername = foundUser[0].username;
						blog.authorFirstName = foundUser[0].firstName;
						blog.authorLastName = foundUser[0].lastName;
						blog.authorImage = foundUser[0].img;
						blog.save();
					}
				});
			}
			res.render("blogs", {blogs: blogs});
		}
	});
});

app.get("/blogs/new", isLoggedIn, function(req, res){
	res.render("new");
});

app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	console.log(req.user);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			console.log("Error! ", err);
		}else{
			User.findById(req.user._id, (err, foundUser) => {
				if(err){
					console.log(err);
				}else{
					foundUser.myBlogs.push(newBlog);
					foundUser.save();
					res.redirect("/blogs");
				}
			});
		}
	});
});

app.get("/blogs/:id", isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log("Error! ", err);
			res.redirect("/blogs");
		}else{
			res.render("show", {blog : foundBlog});
		}
	});
});

app.get("/blogs/:id/edit", isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log("Error! ", err);
			res.redirect("/blogs")
		}else{
			res.render("edit", {blog : foundBlog});
		}
	});
	
})

app.put("/blogs/:id", isLoggedIn, function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			console.log("Error! ", err);
			res.redirect("/blogs");
		}else{
			res.redirect(`/blogs/${req.params.id}`);
		}
	});
});

app.delete("/blogs/:id", isLoggedIn, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("Error! ", err);
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}	
	});
});

// ######################## USER PAGE #########################
app.get("/mypage/:id", isLoggedIn, (req, res) => {
	res.render("showUser");
});

// image update
app.put("/mypage/:id/upload", isLoggedIn, upload.single('image'), (req, res, next) => {
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			foundUser.img = {
				data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
            	contentType: 'image/png'
			}
			console.log(foundUser);
			foundUser.save();
			setTimeout(function(){
				res.redirect(`/mypage/${req.params.id}`);
			}, 0);
		}
	})
});

// links update
app.put("/mypage/:id/links", isLoggedIn, (req, res) => {
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log("Error! ", err);
		}else{
			for (const name in req.body) {
				if(Object.keys(foundUser.links).indexOf(name) === -1){
					let obj = {};
					obj[name] = req.body[name];
					foundUser.links.push(obj);
				}
			  }
			foundUser.save();
			setTimeout(function(){
				res.redirect(`/mypage/${req.params.id}`);
			}, 0);
		}
	});
});

// all other info update
app.put("/mypage/:id", isLoggedIn, (req, res) => {
	User.findByIdAndUpdate(req.params.id, req.body, function(err, updatedBlog){
		if(err){
			console.log("Error! ", err);
		}else{
			setTimeout(function(){
				res.redirect(`/mypage/${req.params.id}`);
			}, 0);
		}
	});
});


// ######################## AUTHENTICATION #########################
app.get("/login", (req, res) => {
	console.log("GET TO LOGIN");
	res.render("login");
});

// LOGIN POST
app.post("/login",
	passport.authenticate("local", 
	{successRedirect: "/blogs", failureRedirect: "/register"}
));

// SIGN UP GET
app.get("/register", (req, res) =>{
	res.render("register");
});

// SIGN UP POST
app.post("/register", (req, res, next) => {
	const newUser = new User(
		{
			username: req.body.username, 
		});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			res.redirect("/register");
			return
		}else{
			console.log(user);
			next();
		}
	})},passport.authenticate('local'), function(req, res) {
		res.redirect('/blogs');
});

app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/blogs");
});



app.listen(process.env.PORT || 3000, () => {
	console.log("server has started");
});
