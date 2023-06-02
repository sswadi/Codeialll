const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//here we are telling passport to use localStrategy
//authetication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
    },
    async function(email, password, done) {
        try {
          const user = await User.findOne({ email: email });
          if (!user || user.password !== password) {
            console.log('Invalid username/password');
            return done(null, false);
          }
          return done(null, user);  //here when the user is found, this function returns the user but where? it return to serialiseUser function (below)

        } catch (err) {
          console.log('Error(system) in finding the user ---> passport');
          return done(err);
        }
      }
)); 

//serialization - encrypting the id into the cookie which happens while sending it to the browser from server
//serialising the user to decide which key is to be kept in the cookie
// Serialization refers to the process of converting an object into a format that can be easily stored, transmitted, or reconstructed later.
passport.serializeUser(function(user, done){
    done(null, user.id); //here it gets the user id from the above function; here serializeUser will store the id in the session cookie which is encrypted using session middleware(in index.js file)
});


//deserialization - while sending the cookie back to server the id is decoded
//deserialize the user from the key in the cookies
passport.deserializeUser(async function(id, done){
    try{
        const user = User.findById(id);
        // console.log(user);
        if(!user){
            console.log('User not found');
            return done(null, false);
        }
        return done(null, user);

    }catch(err){
        console.log(' Error(system) in finding the user ---> passport(deserialize) ');
        return done(err);
    } 
});


//check if the user is autheticated(ie .signed in or not) and then send the data to ejs(views)
//the below function will be used as a middleware(created by us)
passport.checkAuthetication = function(req, res, next){
    //user is signed-in
    if(req.isAuthenticated()){
        return next();
    }
    //if user is not signed-in
    return res.redirect('/sign_in');
}


//when user is signed in(confirmed above) we set the user for the viewss
//it is a middleware created by us
passport.setAutheticatedUser = function(req, res, next){
    if(req.isAuthenticated){
        //req.user contains the current signed in user from the session cookies and we send it to the locals for views
        // console.log(res.locals.user);
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;




















//-----------------------------------------------------------
//the below code was not written using async

// passport.use(new LocalStrategy({
//     usernameField: 'email',
// },
// function(email, password, done){
//     //find a user and establish the identity
//     User.findOne({email: email}, function(err, user){ //in email:email, the first email is email in db and 2nd one is that being passed
//         if(err){
//             console.log('Error(system) in finding the user ---> passport');
//             return done(err);
//         }
//         if( !user || user.password != password){
//             console.log('Invalid usrname/password');
//             return done(null, false);
//         }
//         return done(null, user);
//     });
// }

//error: Model.findOne() no longer accepts a callback

// )); 



//deserialization - while sending the cookie back to server the id is decoded
//deserialize the user from the key in the cookies

// passport.deserializeUser(function(id, done){
//     User.findById(id, function(err, user){
//         if(err){
//             console.log(' Error(system) in finding the user ---> passport(deserialize) ');
//             return done(err);
//         }

//         return done(null, user);
//     });
// });

//error: Model.findById() no longer accepts a callback