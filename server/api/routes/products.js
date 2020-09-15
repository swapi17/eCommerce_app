const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const dir = './uploads';
const path = require('path'); 
const AuthenticationController = require('../controllers/authentication'),       
    passport = require('passport');
    myPassportService = require('../config/passport')(passport);

const requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
const productController = require('../controllers/products');

const upload = multer({storage: multer.diskStorage({

    destination: function (req, file, callback) {
     
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: function (req, file, callback) 
    { callback(null, file.fieldname +'-' + Date.now()+path.extname(file.originalname));}
  
  }),
  
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
  });

router.get('/',requireAuth, AuthenticationController.roleAuthorization(['admin','supervisor','customer']), productController.findAll);

router.post('/',requireAuth, AuthenticationController.roleAuthorization(['admin','supervisor','customer']), productController.getProduct);

router.post('/create', requireAuth, AuthenticationController.roleAuthorization(['supervisor']),upload.single('image1'), productController.create);

router.post('/create/excel',requireAuth, AuthenticationController.roleAuthorization(['admin','supervisor','customer']), upload.single("uploadFile"), productController.createExcelProduct);

router.get('/:id', requireAuth, AuthenticationController.roleAuthorization(['admin','supervisor','customer']),productController.findOne);

router.patch('/:id', requireAuth, AuthenticationController.roleAuthorization(['supervisor']), productController.update);

router.delete('/:id',requireAuth, AuthenticationController.roleAuthorization(['supervisor']), productController.delete);

module.exports = router;