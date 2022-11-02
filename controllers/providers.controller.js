const fetch = require('node-fetch');
// const { checkBody } = require('../modules/checkBody');

const UBER_URL = 'https://backend-providers-wine.vercel.app/uber/settings';
const HEETCH_URL = 'https://backend-providers-wine.vercel.app/heetch/settings';
const BOLT_URL = 'https://backend-providers-wine.vercel.app/bolt/settings';

const getProviders = async (req, res) => {
  const settings = {
    clientNoteMin: 4,
    priceMin: 30,
    markupMin: 1.5,
    distanceMax: 3000,
    travelTimeMax: 15,
  };

  const postHeader = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  };

  const uber = await fetch(UBER_URL, postHeader);
  const uberRides = await uber.json();

  const heetch = await fetch(HEETCH_URL, postHeader);
  const heetchRides = await heetch.json();

  const bolt = await fetch(HEETCH_URL, postHeader);
  const boltRides = await bolt.json();

  const all = [...uberRides.data, ...heetchRides.data, ...boltRides.data];

  res.json({ result: 'providers merged', data: all });
};

module.exports = {
  getProviders,
};
