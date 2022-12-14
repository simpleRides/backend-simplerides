const fetch = require('node-fetch');

const { checkBody } = require('../modules/checkBody');
const User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const SettingsSet = require('../models/settingsSets');

const PROVIDERS_URL = 'https://backend-providers-pi.vercel.app/users';

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
      res.json({
        result: true,
        username: data.username,
        token: data.token,
        providers: data.providers,
      });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
};

const postAddProvider = (req, res) => {
  if (!checkBody(req.body, ['token', 'name'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // $addtoSet ajoute au document trouvé, returnDocument renvoie le document en réponse
  User.findOneAndUpdate(
    { token: req.body.token },
    {
      $addToSet: {
        providers: {
          providername: req.body.name,
          providerToken: '',
          isConnected: true,
        },
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
      res.json({ result: false, error: 'Provider not added' });
    }
  });
};

const postCheckProvider = (req, res) => {
  if (!checkBody(req.body, ['token', 'name', 'check'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // .$ permet de naviguer dans l'objet providers
  User.findOneAndUpdate(
    { token: req.body.token, 'providers.providername': req.body.name },
    {
      $set: {
        'providers.$.isConnected': req.body.check,
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
};

const postRemoveProvider = (req, res) => {
  if (!checkBody(req.body, ['token', 'name'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOneAndUpdate(
    { token: req.body.token },
    {
      $pull: {
        providers: { providername: req.body.name },
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
      res.json({ result: false, error: 'Provider not removed' });
    }
  });
};

const postConnectProvider = (req, res) => {
  if (
    !checkBody(req.body, ['token', 'nameProvider', 'idProvider', 'pwdProvider'])
  ) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Le hash, ci-dessous, fait par le backend SR, est à remplacer par le retour de l'appel au backend Provider
  // const hashProvider = bcrypt.hashSync(req.body.pwdProvider, 10);
  fetch(`${PROVIDERS_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: req.body.idProvider,
      password: req.body.pwdProvider,
    }),
  })
    .then((response) => response.json())
    .then((dataProvider) => {
      if (dataProvider.result) {
        console.log('tokenProvider', dataProvider.token);

        User.findOneAndUpdate(
          { token: req.body.token },
          {
            $addToSet: {
              providers: {
                providername: req.body.nameProvider,
                providerToken: dataProvider.token,
                isConnected: true,
              },
            },
          },
          { returnDocument: 'after' }
        ).then((dataAfter) => {
          if (dataAfter) {
            res.json({
              result: true,
              username: dataAfter.username,
              token: dataAfter.token,
              // providers: dataAfter.providers,
              tokenProvider: dataProvider.token,
            });
            console.log(dataAfter);
          } else {
            res.json({ result: false, error: 'Provider not added' });
          }
        });
      }
    })
    .catch((error) => console.log('webservice provider, Err:', error));
};

// requête put pour actualiser la BDD
const putAddSettings = (req, res) => {
  const settings = {
    clientNoteMin: req.body.clientNoteMin,
    pickupDistanceMax: req.body.pickupDistanceMax,
    priceMin: req.body.priceMin,
    distanceMax: req.body.distanceMax,
    markupMin: req.body.markupMin,
  };

  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token }).then((dataBefore) => {
    if (dataBefore) {
      SettingsSet.findOne({ token: req.body.token }).then((response) => {
        if (response) {
          SettingsSet.updateOne({ token: response.token }, settings).then(() =>
            res.json({ result: true, message: 'User settings updated' })
          );
        } else {
          const newSettingsSet = new SettingsSet(settings);

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
        }
      });
    }
  });
};

// Récupère les settings dans la bdd pour un user
// populate de la clé étrangère settingsSet chez User
const postUsersInfos = (req, res) => {
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token })
    .populate('settingsSet')
    .then((data) => res.json({ result: true, data: data.settingsSet }));
};

module.exports = {
  postSignUp,
  postSignIn,
  postAddProvider,
  postCheckProvider,
  postRemoveProvider,
  postConnectProvider,
  putAddSettings,
  postUsersInfos,
};
