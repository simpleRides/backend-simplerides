const { checkBody } = require('../modules/checkBody');
const User = require('../models/users');
const SettingsSet = require('../models/settingsSets');

const postFindOneById = (req, res) => {
  if (!checkBody(req.body, ['id'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ _id: req.body.id }).then((data) => {
    if (data) {
      console.log(data);
      res.json({ result: true, username: data.username, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong id' });
    }
  });
};

const postFindOneByToken = (req, res) => {
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token }).then((data) => {
    if (data) {
      console.log(data);
      res.json({ result: true, username: data.username, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong token' });
    }
  });
};

const deleteOneById = (req, res) => {
  if (!checkBody(req.body, ['id'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.deleteOne({ _id: req.body.id }).then((data) => {
    if (data.deletedCount > 0) {
      res.json({
        result: true,
        message: `${data.deletedCount} users deleted from database.`,
      });
    } else {
      res.json({ result: false, error: 'Nothing to delete' });
    }
  });
};

const deleteOneByToken = (req, res) => {
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.deleteOne({ token: req.body.token }).then((data) => {
    if (data.deletedCount > 0) {
      res.json({
        result: true,
        message: `${data.deletedCount} users deleted from database.`,
      });
    } else {
      res.json({ result: false, error: 'Nothing to delete' });
    }
  });
};

const deleteAll = (req, res) => {
  User.deleteMany().then((data) => {
    if (data.deletedCount > 0) {
      res.json({
        result: true,
        message: `${data.deletedCount} users deleted from database.`,
      });
    } else {
      res.json({ result: false, error: 'Nothing to delete' });
    }
  });
};

const addSettingsDirectly = (req, res) => {
  // if (!checkBody(req.body, ["providers", "customergrade", "pickupDistance", "ridePrice", "rideDistance", "ridemarkup"])) {
  if (!checkBody(req.body, ['customergradecheck', 'customergradevalue'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const newSettingsSet = new SettingsSet({
    providers: [],
    customerGrade: {
      isChecked: req.body.customergradecheck,
      value: req.body.customergradevalue,
    },
    pickupDistance: {},
    ridePrice: {},
    rideDistance: {},
    rideMarkup: {},
  });

  newSettingsSet.save().then((newDoc) => {
    res.json({ result: true, settingsSet: newDoc });
  });
};

module.exports = {
  postFindOneById,
  postFindOneByToken,
  deleteOneById,
  deleteOneByToken,
  deleteAll,
  addSettingsDirectly,
};
