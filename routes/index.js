const express = require("express");
const router  = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/",(req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
   res.render("register"); 
});

//handle sign up logic
router.post("/register", (req, res) =>{
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) =>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("sucess", "You have sucessfuly registered")    
            res.redirect("/campgrounds"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {message: req.flash("error")}); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout",function(req, res){
   req.logout();
   req.flash("sucess", "You have sucessfuly logged out");
   res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;