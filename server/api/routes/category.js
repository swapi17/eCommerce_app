const express = require("express");
const router = express.Router();
const AuthenticationController = require('../controllers/authentication'),       
    passport = require('passport');
    myPassportService = require('../config/passport')(passport);

const requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
const categoryController = require("../controllers/category");


router.get("/",requireAuth, AuthenticationController.roleAuthorization(['admin','supervisor']),categoryController.findAll);
router.post("/",requireAuth, AuthenticationController.roleAuthorization(['admin']), categoryController.create);
router.patch("/:id",requireAuth, AuthenticationController.roleAuthorization(['admin']), categoryController.update);
router.delete("/:id",requireAuth, AuthenticationController.roleAuthorization(['admin','supervisor']),categoryController.delete);

module.exports = router;
