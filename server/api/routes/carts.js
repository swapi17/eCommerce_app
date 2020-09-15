const express = require('express');
const router = express.Router();
const AuthenticationController = require('../controllers/authentication'),       
    passport = require('passport');
    myPassportService = require('../config/passport')(passport);

const requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
const cartController = require('../controllers/carts');


router.post('/', requireAuth, AuthenticationController.roleAuthorization(['customer']),cartController.create);

router.get('/:id', requireAuth, AuthenticationController.roleAuthorization(['customer']),cartController.findOne);

router.post('/:id', requireAuth, AuthenticationController.roleAuthorization(['customer']),cartController.updateCart);

router.post('/update-item-qty/:id',requireAuth, AuthenticationController.roleAuthorization(['customer']),cartController.updateCartItemQty);

router.post('/delete-item/:id', requireAuth, AuthenticationController.roleAuthorization(['customer']),cartController.deleteCartItem);

router.delete('/:id', requireAuth, AuthenticationController.roleAuthorization(['customer']),cartController.delete);

module.exports = router;