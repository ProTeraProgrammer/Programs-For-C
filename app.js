// To serve static files such as images, CSS files, and JavaScript files, use the express.static built
// in middleware function in Express.

// However, the path that you provide to the express.static function is relative to the directory
// from where you launch your node process.

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.connect("mongodb://localhost:27017/userDB"); // start mongodb server first

const userSchema = mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});


const User = new mongoose.model("User",userSchema);



app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({ // create a new document using our model
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){ // mongoose encrpt was able to successsfully decrypt the password
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username},function(err,foundUser){
    if (err){
      console.log(err);
    } else{
      if (foundUser) {
        if (foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});




//handel request using route handelers


















app.listen(3000, function(){
  console.log("Server started on port 3000");
})
