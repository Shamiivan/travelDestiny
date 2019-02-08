const   express = require("express"),
        router  = express.Router(),
        Destination = require("../models/destination"),
        middleware = require("../middleware");


//INDEX 
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

//CREATE
router.post("/", middleware.isLoggedIn, (req, res)=>{
    let author = {
        id: req.user._id,
        username: req.user.username
        
    };
    let {name: name, image: image, description: desc} = req.body;
    let newDestination = {name: name, image: image, description: desc, author:author};
    Destination.create(newDestination, (err, newlyCreated)=>{
        if(err){
            console.log("ERROR CREATING DESTINATION :" + err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/destinations");
        }
    });
});

//NEW
router.get("/new", middleware.isLoggedIn, (req, res)=>{
   res.render("destinations/new"); 
});

//SHOW PAGE
router.get("/:id", (req, res)=>{
    Destination.findById(req.params.id).populate("comments").exec((err, foundDestination)=>{
        if(err){
            console.log("ERROR COMMENT POPULATING" + err);
        } else {
            res.render("destinations/show", {destination: foundDestination});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
    Destination.findById(req.params.id, (err, foundDestination)=>{
            if(err){
        console.log("ERROR GETTING THE EDIT PAGE" + err);
            }else{
        res.render("destinations/edit", {destination: foundDestination});
    }
    });
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
    Destination.findByIdAndUpdate(req.params.id, req.body.destination,(err, updatedDestination)=>{
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/destinations/" + req.params.id);
       }
    });
});

// DESTROY
router.delete("/:id",middleware.checkCampgroundOwnership,(req, res)=>{
   Destination.findByIdAndRemove(req.params.id,(err)=>{
      if(err){
          res.redirect("/destinations");
      } else {
          res.redirect("/destinations");
      }
   });
});


module.exports = router;