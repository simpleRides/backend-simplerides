const mongoose = require('mongoose');

const settingsSetSchema = mongoose.Schema({
  token: String,
  clientNoteMin: Number,
  pickupDistanceMax: Number,
  priceMin: Number,
  distanceMax: Number,
  markupMin: Number,
});

const SettingsSet = mongoose.model('settingsSets', settingsSetSchema);

module.exports = SettingsSet;
