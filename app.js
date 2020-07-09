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


mongoose.connect("mongodb://localhost:27017/blog_camp", {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
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

app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("Error! ", err);
		}else{
			res.render("index", {blogs: blogs});
		}
	});
});

app.get("/blogs/new", function(req, res){
	res.render("new");
});

app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			console.log("Error! ", err);
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log("Error! ", err);
			res.redirect("/blogs");
		}else{
			res.render("show", {blog : foundBlog});
		}
	});
});

app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log("Error! ", err);
			res.redirect("/blogs")
		}else{
			res.render("edit", {blog : foundBlog});
		}
	});
	
})

app.put("/blogs/:id", function(req, res){
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

app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("Error! ", err);
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}	
	});
});

app.get("/mypage/:id", isLoggedIn, (req, res) => {
	res.render("showUser");
});

// LOGIN GET
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
			email: req.body.email, 
			name: `${req.body.firstName} ${req.body.lastName}`
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


// const ifLoggedIn = (req, res, next){

// }