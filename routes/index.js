const   express = require("express"),
        router  = express.Router(),
        passport = require("passport"),
        User = require("../models/user");

router.get("/",(req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
   res.render("register"); 
});

//REGISTER LOGIC
router.post("/register", (req, res) =>{
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) =>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("sucess", "You have sucessfuly registered");    
            res.redirect("/campgrounds"); 
        });
    });
});

router.get("/login", function(req, res){
   res.render("login", {message: req.flash("error")}); 
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/destinations",
        failureRedirect: "/login"
    }), function(req, res){
});


router.get("/logout",function(req, res){
   req.logout();
   req.flash("sucess", "You have sucessfuly logged out");
   res.redirect("/destinations");
});

module.exports = router;