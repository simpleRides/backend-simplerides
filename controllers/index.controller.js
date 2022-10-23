const getWelcomeMsg = (req, res) => {
  res.json({ result: "Welcome to simpleRide API"})
};

module.exports = {
  getWelcomeMsg,
};
