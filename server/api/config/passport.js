const passport = require('passport');
const User = require('../models/user');
const config = require('./auth');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const localOptions = {
    usernameField: 'email'
};
console.log(config.secret);
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
    
    console.log("Local Strategy");
    User.findOne({
        email: email
    }, function(err, user){
        
        if(err){
            return done(err);
        }

        if(!user){
            return done(null, false, {error: 'Login failed. Please try again.'});
        }
        console.log(password);
        user.comparePassword(password, function(err, isMatch){
            
            if(err){
                return done(err);
            }

            if(!isMatch){
                
                return done(null, false, {error: 'Login failed. Please try again.'});
            }

            return done(null, user);

        });

    });

});

// const jwtOptions = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
//     secretOrKey: config.secret
// };

const jwtOptions = {
    
};
jwtOptions.jwtFromRequest = ExtractJwt.fromBodyField('JWT');
jwtOptions.secretOrKey = config.secret;
//console.log(jwtOptions.jwtFromRequest);

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    console.log("Extracted JWT"+payload);
    User.findById(payload._id, function(err, user){

        if(err){
            return done(err, false);
        }
        if(user){
            done(null, user);
        } else {
            done(null, false);
        }

    });

});



module.exports = function (passport) {


    passport.use(jwtLogin);
    passport.use(localLogin);
}