var express = require("express");
var router  = express.Router({mergeParams: true});
var Destination = require("../models/destination");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn,function(req, res){
    // find campground by id
    console.log(req.params.id);
    Destination.findById(req.params.id, function(err, destination){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {destination: destination});
        }
    });
});

//Comments Create
// router.post("/",middleware.isLoggedIn,function(req, res){
//   //lookup campground using ID
//   Destination.findById(req.params.id, function(err, destination){
//       if(err){
//           console.log(err);
//           res.redirect("/destinations");
//       } else {
//           console.log("The body is "+ req.body);
//         Comment.create(req.body.comment, function(err, comment){
//           if(err){
//               console.log(err);
//           } else {
//               console.log("The params are "+ req.params);
//               //add username and id to comment
//               comment.author.id = req.user._id;
//               comment.author.username = req.user.username;
//               //save comment
//               comment.save();
//               console.log("Destinations are "+Destination.comments)
//             //   Destination.comments.push(comment);
//             //   Destination.save();
//               console.log(comment);
//               res.redirect('/destinations/' + Destination._id);
//           }
//         });
//       }
//   });
// });

router.post("/",middleware.isLoggedIn,(req,res) => {
    Destination.findById(req.params.id, (err,foundDestination) =>{
        if(err){
            console.log("ERROR FINDING THE DESTINATION ID: " +  err);
            res.redirect("/destinations");
        } else {
            console.log("THIS IS THE DESTINATION OBJ : "+ foundDestination);
            Comment.create(req.body.comment, (err, comment) =>{
                if(err){
                    console.log("ERROR CREATING COMMENT: " + err);
                } else{
                comment.author.id =req.user._id;
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
// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

module.exports = router;