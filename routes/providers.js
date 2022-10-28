var express = require('express');
var router = express.Router();

require('../models/connection');
const providersController = require('../controllers/providers.controller');

router.get('/ping', providersController.getWelcomeMsg3);

module.exports = router;
