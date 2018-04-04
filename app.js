var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
const http = require("http");
const express = require("express");
const port = process.env.PORT || 3000;
var bcrypt = require("bcrypt"); 
var username = "cmps369";
var password = "finalproject";
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        password = hash;
        console.log("Hashed password = " + password);
    });
});

var routes = require("./routes/index.js");

////////////////////////////////////////////////////
// Basic express configuration
////////////////////////////////////////////////////
const app = express();
app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//MONGO DB CONFIG
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/contacts';


MongoClient.connect(url, function(err, db) {
      if(err == null){
        console.log("Connected correctly to server.");   
        contactsdb = db.collection('contacts')
      }
});;


// add the database to every request object
app.use(function(req, res, next) {
  req.db = contactsdb;
  next();
});

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({ secret: 'cmps369'}))
app.use(express.static(path.join(__dirname, 'public')));


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());





passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },

    function(user, pswd, done) {
        if ( user != username ) {
            console.log("Username mismatch");
            return done(null, false);
        }

        bcrypt.compare(pswd, password, function(err, isMatch) {
            if (err) return done(err);
            if ( !isMatch ) {
                console.log("Password mismatch");
            }
            else {
                console.log("Valid credentials");
            }
            done(null, isMatch);
        });
      }
  ));

  app.use(function (req, res, next){
    res.locals.user = req.user;
    next();
  });

  passport.serializeUser(function(username, done) {
      // this is called when the user object associated with the session
      // needs to be turned into a string.  Since we are only storing the user
      // as a string - just return the username.
      done(null, username);
  });

  passport.deserializeUser(function(username, done) {
      // normally we would find the user in the database and
      // return an object representing the user (for example, an object
      // that also includes first and last name, email, etc)
      done(null, username);
   });


// Posts to login will have username/password form data.
// passport will call the appropriate functions...
routes.post('/login',
    passport.authenticate('local', { successRedirect: '/home',
                                     failureRedirect: '/login',
                                  })
);

routes.get('/login', function (req, res) {
  res.render('login', {});
});

routes.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});


////////////////////////////////////////////////////
// Route configuration
////////////////////////////////////////////////////
app.use('/', routes);

////////////////////////////////////////////////////
// Startup
////////////////////////////////////////////////////
server = http.Server(app);
server.listen(port);
