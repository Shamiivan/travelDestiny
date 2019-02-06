To run the mongod : ./mongod
and we use the syntax to connect to mongo DB as such: 
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});


#YelpCamp

##Initial Setup

Add Landing Page
Add Campgrounds Page that lists all campgrounds
Each Campground has:

Name
Image
#Layout and Basic Styling

Create our header and footer partials
Add in Bootstrap
#Creating New Campgrounds

Setup new campground POST route
Add in body-parser
Setup route to show form
Add basic unstyled form
#Style the campgrounds page

Add a better header/title
Make campgrounds display in a grid

#Style the Navbar and Form

Add a navbar to all templates
Style the new campground form

#Add Mongoose

Install and configure Mongoose
Setup campground model
Use campground model inside of our routes


#Show Page

Review the RESTful routes we've seen so far
Add description to our campground model

Show db.collection.drop(): used to destroy everything in the DB
Add a show route/template


RESTFUL ROUTES
name     url           request   description
======================================
Index   /dogs          GET       display a list of all dog
NEW     /dogs/new      GET       display a form to make a new dog
CREATE  /dogs          POST      add new dog to DB, then redirect
SHOW    /dogs/:id      GET       shows more info about one specific dog
EDIT    /dogs/:id/edit GET       shows edit from one dog
UPDATE  /dogs/:id      PUT       updates a particular dog
DESTROY /dogs/:id      DELETE    delete a particular dog, then redirect

