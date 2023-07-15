const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "1224.apps.googleusercontent.com",
    clientSecret: "12",
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