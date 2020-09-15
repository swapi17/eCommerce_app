const express = require('express');
const router = express.Router();
const AuthenticationController = require('../controllers/authentication'),       
    passport = require('passport');
    myPassportService = require('../config/passport')(passport);

const requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});



    // Auth Routes
   
    router.post('/register', AuthenticationController.register);
    router.post('/login', requireLogin, AuthenticationController.login);

    router.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });

    
 
module.exports = router;