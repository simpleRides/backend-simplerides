const mongoose = require('mongoose');

const settingsSetSchema = mongoose.Schema({
  token: String,
  clientNoteMin: Number,
  pickupDistanceMax: Number,
  ridePriceMin: Number,
  rideDistanceMax: Number,
  rideMarkupMin: Number,
});

const SettingsSet = mongoose.model('settingsSets', settingsSetSchema);

module.exports = SettingsSet;
