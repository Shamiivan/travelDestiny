const   express = require("express"),
        router  = express.Router(),
        Destination = require("../models/destination"),
        middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/",(req, res) => {
    // Get all campgrounds from DB
    Destination.find({}, (err, allDestinations)=>{
       if(err){
           console.log("ERROR FINDING DESTINATIONS: " + err);
       } else {
          res.render("destinations/index", {destinations:allDestinations});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res)=>{
    // get data from form and add to campgrounds array
    let name = req.body.name,
        image = req.body.image,
        desc = req.body.description,
        author = {
        id: req.user._id,
        username: req.user.username};
        let newDestination = {name: name, image: image, description: desc, author:author};
    Destination.create(newDestination, function(err, newlyCreated){
        if(err){
            console.log("ERROR CREATING DESTINATION :" + err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/destinations");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("destinations/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Destination.findById(req.params.id).populate("comments").exec(function(err, foundDestination){
        if(err){
            console.log("comments referencing" + err);
        } else {
            console.log(foundDestination);
            //render show template with that campground
            res.render("destinations/show", {destination: foundDestination});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Destination.findById(req.params.id, function(err, foundDestination){
        res.render("destinations/edit", {destination: foundDestination});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Destination.findByIdAndUpdate(req.params.id, req.body.destination, function(err, updatedDestination){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/destinations/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
   Destination.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/destinations");
      } else {
          res.redirect("/destinations");
      }
   });
});


module.exports = router;