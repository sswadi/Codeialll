//setting up passport jwt strat
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt; //module that'll help us extract jwt from the header


const User = require('../models/user');

// Set up options for JWTStrategy
let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial',
}

// Configure JWTStrategy with options and callback function
passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){

    User.findById(jwtPayLoad._id)
    .then((user) => {

        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }

    }).catch(err =>{

        console.log('Error in finding user from JWT');
        return;
    });
}));

module.exports = passport;
