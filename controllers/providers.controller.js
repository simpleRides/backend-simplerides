const { checkBody } = require('../modules/checkBody');
const Provider = require('../models/providers');

const getWelcomeMsg3 = (req, res) => {
  res.json({ result: 'Welcome to simpleRide API' });
};

module.exports = {
  getWelcomeMsg3,
};
