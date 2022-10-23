var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index.controller');


router.get('/ping', indexController.getWelcomeMsg);

module.exports = router;
