const { checkBody } = require('../modules/checkBody');
const User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const SettingsSet = require('../models/settingsSets');

const getWelcomeMsg2 = (req, res) => {
  res.json({ result: 'Welcome to simpleRide API' });
};

const postSignUp = (req, res) => {
  if (!checkBody(req.body, ['email', 'password', 'username', 'phone'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        password: hash,
        username: req.body.username,
        phone: req.body.phone,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
};

const postSignIn = (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, username: data.username, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
};

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

const postAddProvider = (req, res) => {
  if (!checkBody(req.body, ['token', 'name'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOneAndUpdate(
    { token: req.body.token },
    {
      $addToSet: {
        providers: { providername: req.body.name, isConnected: true },
      },
    },
    { returnDocument: 'after' }
  ).then((dataAfter) => {
    if (dataAfter) {
      res.json({
        result: true,
        username: dataAfter.username,
        token: dataAfter.token,
        providers: dataAfter.providers,
      });
    } else {
      res.json({ result: false, error: 'Provider not updated' });
    }
  });

  /*
  User.postFindOneByToken({ token: req.body.token }).then(dataBefore => {
    if (dataBefore) {
      console.log(data);
      User.findOneAndUpdate(
        { token: req.body.token },
        { $addToSet : { providers: { providername: req.body.name, isConnected: true } }},
        { returnDocument: 'after' },
      ).then(dataAfter => {
        if (dataAfter) {
          res.json({ result: true, username: dataAfter.username, token: dataAfter.token, providers: dataAfter.providers });
        } else {
          res.json({ result: false, error: 'Provider not updated' });
        }
      });
      res.json({ result: true, username: dataBefore.username, token: dataBefore.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong id' });
    }
  });
  */
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

const postAddSettings = (req, res) => {
  // if (!checkBody(req.body, ["providers", "customergrade", "pickupDistance", "ridePrice", "rideDistance", "ridemarkup"])) {
  if (
    !checkBody(req.body, ['token', 'customergradecheck', 'customergradevalue'])
  ) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token }).then((dataBefore) => {
    if (dataBefore) {
      console.log(dataBefore);

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
        User.findOneAndUpdate(
          { token: req.body.token },
          { settingsSet: newDoc._id }
        ).then((dataAfter) => {
          if (dataAfter) {
            res.json({
              result: true,
              username: dataAfter.username,
              token: dataAfter.token,
            });
          } else {
            res.json({ result: false, error: 'Settings and user updated' });
          }
        });
      });
    } else {
      res.json({ result: false, error: 'User not found or wrong token' });
    }
  });
};

module.exports = {
  getWelcomeMsg2,
  postSignUp,
  postSignIn,
  postFindOneById,
  postFindOneByToken,
  deleteOneById,
  deleteOneByToken,
  deleteAll,
  postAddProvider,
  addSettingsDirectly,
  postAddSettings,
};
