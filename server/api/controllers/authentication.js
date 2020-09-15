const jwt = require('jsonwebtoken');  
const User = require('../models/user');
const authConfig = require('../config/auth');
//production redis url
let redis_url = process.env.REDIS_URL;
if (process.env.ENVIRONMENT === 'development') {  
  require('dotenv').config();  
  redis_url = "redis://127.0.0.1"; 
}
//redis setup
let client = require('redis').createClient(redis_url);
let Redis = require('ioredis');
let redis = new Redis(redis_url);

function generateToken(user){
    console.log(authConfig.secret);
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 100800
    });
}

function setUserInfo(request){
    return {
        _id: request._id,
        name: request.name,
        phoneNumber: request.phoneNumber,
        email: request.email,
        role: request.role
    };
}

exports.login = function(req, res, next){

    const userInfo = setUserInfo(req.user);

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });

}

exports.register = function(req, res, next){
    console.log(req.body);
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    if(!email){
        return res.status(422).send({error: 'You must enter an email address'});
    }

    if(!password){
        return res.status(422).send({error: 'You must enter a password'});
    }

    User.findOne({email: email}, function(err, existingUser){

        if(err){
            return next(err);
        }

        if(existingUser){
            return res.status(422).send({error: 'That email address is already in use'});
        }

        const user = new User({
            name: name,
            phoneNumber: phoneNumber,
            email: email,
            password: password,
            role: role
        });

        user.save(function(err, user){

            if(err){
                return next(err);
            }

            const userInfo = setUserInfo(user);

            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            })

        });

    });

}

exports.roleAuthorization = function(roles){

    return function (req, res, next) {

        const userId = req.user._id;
        //console.log(userId);
        //check if rep details are present in cache     
        client.get(JSON.stringify(userId), (error, userRole) => {
            //console.log(userRole);
            if (error) {
                console.log("Redis error");
                res.status(500).json({ error: error });
                return;
            }
            //console.log(roles.indexOf(userRole));
            if (roles.indexOf(JSON.parse(userRole)) > -1) {
                console.log("Role found in Redis");
                return next();
            }
            else {
                //if data not present in cache, make a request to db
                User.findById(userId, function (err, foundUser) {
                    console.log(foundUser.role);
                    if (err) {
                        res.status(422).json({ error: 'No user found.' });
                        return next(err);
                    }
                    console.log(roles.indexOf(foundUser.role));
                    if (roles.indexOf(foundUser.role) > -1) {
                        //cache data received from db          
                        client.set(JSON.stringify(userId), JSON.stringify(foundUser.role), (error, result) => {
                            if (error) {
                                res.status(500).json({ error: error });
                            }
                            console.log("Role found in MongoDB...");
                        })
                        return next();
                    }

                    res.status(401).json({ error: 'You are not authorized to view this content' });
                    return next('Unauthorized');

                });

            }                     
           
      //end of outer else
}) ; //end of clinet.get 

}

}
