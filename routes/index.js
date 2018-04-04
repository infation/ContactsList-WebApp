
var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId; 
var NodeGeocoder = require('node-geocoder');

var geocoder = NodeGeocoder({
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyCLVicJg63qrPqHG7Nw5qifhIfSmVxGjWM', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  });
  
var ensureLoggedIn = function(req, res, next) {
    console.log(req.user)
    if ( req.user ) {
		next();
	}
	else {
		res.redirect("/login");
	}
}


module.exports = router;

var start = function(req, res, next){
    res.render('home', {});
};

var mailer = function(req, res, next){
    res.render('mailer', {});
};

var submission = function(req, res, next){
    processContactInfo(req,false); 
    res.render('submission', {});
};

var display_contacts = function(req, res, next){
    req.db.find({}).toArray(function (err, result) {
        res.render("contacts", {contacts: result});
    });
};

var update_contact = function(req, res, next){
    req.db.findOne({_id: ObjectId(req.query._id)}, function (err, result) {
        res.render("update", {_id: req.query._id, contact: result.contact})
    });
}; 

var delete_contact = function(req, res, next){
    req.db.deleteOne({_id: ObjectId(req.body._id)}, function(){
        req.db.find({}).toArray(function (err, result) {
            res.render("contacts", {contacts: result});
        })
    });
}

var update_db = function(req, res, next){
    //req.db.updateOne( {_id:ObjectID(req.body._id)}, {'$set': {contact : req.body}});
    processContactInfo(req, res, true);
        //res.render("contacts", {contacts: result});
}; 

function processContactInfo(req, res, update){
    var contact = {};
    for(var property in req.body){
        if(property != "contactphone" && property != "contactemail" &&property != "contactmail"){
            contact[property] = req.body[property];
        }
    }
 

    if(req.body.contactphone == 'on'){
        contact.contactphone = "Yes";
        console.log(contact);
    }
    else{
        contact.contactphone = "No";
    }

    if(req.body.contactmail == "on"){
        contact.contactmail = "Yes";
    }
    else{
        contact.contactmail = "No";
    }

    if(req.body.contactemail == "on"){
        contact.contactemail = contact.email;
    }
    else{
        contact.contactemail = "None"
    }
    console.log(contact);
    geocode(contact, req.db, update, res)
}



// Using callback
function geocode(contact, db, update, res){
    var address = contact.street + ' ' + contact.city + ' '+ contact.state + ' '+contact.zip;
    if(!update){
        geocoder.geocode(address)
            .then(function(res) {
                contact.lat = res[0].latitude;
                contact.lng = res[0].longitude; 
                db.insert({contact: contact});
            })
            .catch(function(err) {
            console.log(err);
        });
    }
    else{
        geocoder.geocode(address)
        .then(function(res) {
            contact.lat = res[0].latitude;
            contact.lng = res[0].longitude;
            var id = contact._id;
            delete contact._id; 
            db.updateOne({_id: ObjectId(id)}, {'$set': {contact: contact}});
        }).then(function(){
            res.redirect('contacts');
        })
        .catch(function(err) {
        console.log(err);
    });   
    }
};

/* GET start page. 
 I'm allowing the user to hit multiple URLs and 
 still get the same functionality.  I could also
 use regular expressions here, instead of explicitely
 listing multiple url paths.  Choice is yours.
*/
router.get('/', start);
router.get('/home', start);
router.get('/mailer', mailer);
router.get('/submission', start);
router.post('/submission', submission);
router.get('/contacts',ensureLoggedIn, display_contacts);
router.get('/update', ensureLoggedIn, update_contact);
router.post('/update',ensureLoggedIn, update_db);
router.post('/contacts', ensureLoggedIn, delete_contact);

