const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');

//tell passport to use a new strategy for google login
// passport.use(new googleStrategy({
//     clientID: "589513757406-9g3o2ngikfikk63jh5bsbki5svg0k8j4.apps.googleusercontent.com",
//     clientSecret: "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",
//     callbackURL: "http://localhost:8000/auth/google/callback",

// }, 
//     function(accessToken, refreshToken, profile, done){
//         //find a user
//         User.findOne({email: profile.emails[0].value}).exec(function(err, user){
//             if(err){
//                 console.log('Error in google strategy-passpport', err);
//                 return;
//             }

//             if(user){
//                 //if found set the user as req.user(sign ins)
//                 return done(null, user);
//             }else{
//                 //if not found create the user and set is as req.user(which means sign in)
//                 User.create({
//                     name: profile.displayName,
//                     email: profile.emails[0].value,
//                     password: crypto.randomBytes(20).toString('hex'),
//                 }, function(err, user){
//                     if(err){
//                         console.log('Error in creating user for google strategy-passpport', err);
//                         return;
//                     }

//                     return done(null, user);
//                 });
//             }
            
//         });
//     }
// ));


passport.use(new googleStrategy({
    clientID: "589513757406-9g3o2ngikfikk63jh5bsbki5svg0k8j4.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/auth/google/callback",

}, 
    function(accessToken, refreshToken, profile, done){
        //find a user
        User.findOne({email: profile.emails[0].value})
        .then((user) =>{

            if(user){
                //if found set the user as req.user(sign ins)
                return done(null, user);
            }else{
                //if not found create the user and set is as req.user(which means sign in)
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                }).then((user) => {
                    return done(null, user);
                })
            }

        }).catch((err) => {
            console.log('Error in google strategy-passpport', err);
            return;
        });

    }

));

module.exports = passport;