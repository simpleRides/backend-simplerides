var express = require('express');
var router = express.Router();

require('../models/connection');
const usersController = require('../controllers/users.controller');

router.get('/ping', usersController.getWelcomeMsg2);

router.post('/signup', usersController.postSignUp);
router.post('/signin', usersController.postSignIn);

router.post('/findonebyid', usersController.postFindOneById);
router.post('/findonebytoken', usersController.postFindOneByToken);
router.delete('/deleteonebyid', usersController.deleteOneById);
router.delete('/deleteonebytoken', usersController.deleteOneByToken);
router.delete('/deleteall', usersController.deleteAll);

router.post('/addprovider', usersController.postAddProvider);

router.post('/addsettingsdirectly', usersController.addSettingsDirectly);
router.post('/addsettings', usersController.postAddSettings);

module.exports = router;
