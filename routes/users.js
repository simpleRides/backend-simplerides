var express = require('express');
var router = express.Router();

require('../models/connection');
const usersController = require('../controllers/users.controller');

router.get('/ping', usersController.getWelcomeMsg2);

router.post('/signup', usersController.postSignUp);
router.post('/signin', usersController.postSignIn);
router.post('/addprovider', usersController.postAddProvider);
router.post('/checkprovider', usersController.postCheckProvider);
router.post('/removeprovider', usersController.postRemoveProvider);
router.post('/connectprovider', usersController.postConnectProvider);
router.post('/addsettings', usersController.postAddSettings);

module.exports = router;
