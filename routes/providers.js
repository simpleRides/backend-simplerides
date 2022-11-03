const express = require('express');
const router = express.Router();

require('../models/connection');
const providersController = require('../controllers/providers.controller');

router.post('/', providersController.getProviders);

module.exports = router;
