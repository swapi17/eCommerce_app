



const express = require("express");
const router = express.Router();
const AuthenticationController = require('../controllers/authentication'),       
    passport = require('passport');
    myPassportService = require('../config/passport')(passport);

const requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});

const orderController = require("../controllers/order");


router.get("/all",requireAuth, AuthenticationController.roleAuthorization(['admin','supervisor']),orderController.getAllOrders);
router.get("/user-orders",requireAuth, AuthenticationController.roleAuthorization(['customer']),orderController.getUserOrders);

router.post("/checkout",requireAuth, AuthenticationController.roleAuthorization(['customer']), orderController.checkOut);

    
module.exports = router;

  