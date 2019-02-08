const   express     = require("express"),
        router      = express.Router({mergeParams: true}),
        Destination = require("../models/destination"),
        Comment     = require("../models/comment"),
        middleware  = require("../middleware");

//NEW
router.get("/new",middleware.isLoggedIn,(req, res)=>{
    Destination.findById(req.params.id, (err, destination)=>{
        if(err){
            console.log("ERROR FINDING DESTINATION ID FOR COMMENT CREATION: " + err);
        } else {
             res.render("comments/new", {destination: destination});
        }
    });
});

//CREATE
router.post("/",middleware.isLoggedIn,(req,res) => {
    Destination.findById(req.params.id, (err,foundDestination) =>{
        if(err){
            console.log("ERROR FINDING THE DESTINATION ID: " +  err);
            res.redirect("/destinations");
        } else {
            Comment.create(req.body.comment, (err, comment) =>{
                if(err){
                    console.log("ERROR CREATING COMMENT: " + err);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundDestination.comments.push(comment);
                    foundDestination.save();
                    res.redirect('/destinations/' + foundDestination._id);
                }
            });
        }
    });
});

//EDIT 
router.get("/:comment_id/edit", middleware.checkCommentOwnership,(req, res)=>{
   Comment.findById(req.params.comment_id,(err, foundComment)=>{
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership,(req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
       if(err){
           console.log("ERROR DELETING COMMENT :" + err);
           res.redirect("back");
       } else {
           res.redirect("/destinations/" + req.params.id);
       }
    });
});

module.exports = router;