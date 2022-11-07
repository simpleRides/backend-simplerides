const fetch = require('node-fetch');

//  appel des webservices (uber, heetch et bolt) en fonction des filtres (/settings)
const UBER_URL = 'https://providers-sooty.vercel.app/uber/settings';
const HEETCH_URL = 'https://providers-sooty.vercel.app/heetch/settings';
const BOLT_URL = 'https://providers-sooty.vercel.app/bolt/settings';

const getProviders = async (req, res) => {
  // on a utilisé un post au lieu d'un get pour cacher les informations dans le body (body pas disponible en GET) et pour simplifier l'écriture des requêtes
  const settings = {
    clientNoteMin: req.body.clientNoteMin,
    priceMin: req.body.priceMin,
    markupMin: req.body.markupMin,
    distanceMax: req.body.distanceMax,
    travelTimeMax: req.body.travelTimeMax,
  };

  // methodes du fetch dans une constante pour un code plus lisible
  const postHeader = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  };

  // bloc try / catch, test d'exec du code dans try, si erreur, execute catch et ne plante pas le serveur entier
  try {
    const uber = await fetch(UBER_URL, postHeader);
    const heetch = await fetch(HEETCH_URL, postHeader);
    const bolt = await fetch(BOLT_URL, postHeader);

    const uberRides = addProviderName((await uber.json()).data, 'uber');
    const heetchRides = addProviderName((await heetch.json()).data, 'heetch');
    const boltRides = addProviderName((await bolt.json()).data, 'bolt');

    // concaténation / aggrégation de tous les tableaux ensembles
    const allRides = [
      ...filterRides(uberRides),
      ...filterRides(heetchRides),
      ...filterRides(boltRides),
    ];

    res.json({ result: true, data: allRides });
  } catch (error) {
    res.json({ result: false, message: 'Error while fetching url' });
  }
};

// ajout du provider name à l'obet du provider
const addProviderName = (providerRides, provider) => {
  return providerRides.map((e) => ({ ...e, providerName: provider }));
};

// Filtrer les courses et renvoyer une seule course
// on garde les pending, dont la date n'est pas passée, on trie par date, et on retient que la course la plus proche
const filterRides = (providerRides) => {
  return providerRides
    .filter((a) => a.status === 'Pending')
    .filter((a) => Date.parse(a.date) > new Date())
    .sort((a, b) => {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
      return 0;
    })
    .slice(0, 1);
};

module.exports = {
  getProviders,
};
