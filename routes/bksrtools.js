var express = require('express');
var router = express.Router();

require('../models/connection');
const bksrtoolsController = require('../controllers/bksrtools.controller');

router.post('/findonebyid', bksrtoolsController.postFindOneById);
router.post('/findonebytoken', bksrtoolsController.postFindOneByToken);
router.delete('/deleteonebyid', bksrtoolsController.deleteOneById);
router.delete('/deleteonebytoken', bksrtoolsController.deleteOneByToken);
router.delete('/deleteall', bksrtoolsController.deleteAll);
router.post('/addsettingsdirectly', bksrtoolsController.addSettingsDirectly);

module.exports = router;
