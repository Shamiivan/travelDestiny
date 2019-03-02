const express                   = require("express"),
      app                       = express(),
      bodyParser                = require("body-parser"),
      flash                     = require("connect-flash"),
      passport                  = require("passport"),
      methodOverride            = require("method-override"),
      localStrategy             = require("passport-local"),
      User                      = require("./models/user"),
      passportLocalMongoose     = require("passport-local-mongoose"), 
      mongoose                  = require("mongoose"),
      Destination               = require("./models/destination"),
      Comment                   = require("./models/comment"),
      destinationsRoutes        = require("./routes/destinations"),
      commentsRoutes            = require("./routes/comments"),
      indexRoutes               = require("./routes/index");
    
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"I want financial freedom",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) =>{
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//ROUTES
app.get("/register", (req,res) =>{
    res.render("register");
});
app.use("/destinations",destinationsRoutes);
app.use("/destinations/:id/comments",commentsRoutes);
app.use("/",indexRoutes);



app.listen(process.env.PORT, process.env.IP, ()=>{
   console.log("The TravelDestiny Server Has Started!");
});
