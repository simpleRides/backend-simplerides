var express = require('express');
var router = express.Router();

require('../models/connection');
const usersController = require('../controllers/users.controller');

router.post('/', usersController.postUsersInfos);
router.post('/signup', usersController.postSignUp);
router.post('/signin', usersController.postSignIn);
router.post('/connectprovider', usersController.postConnectProvider);
router.put('/addsettings', usersController.putAddSettings);
router.put('/addprovider', usersController.postAddProvider);
router.put('/checkprovider', usersController.postCheckProvider);
router.put('/removeprovider', usersController.postRemoveProvider);

module.exports = router;
