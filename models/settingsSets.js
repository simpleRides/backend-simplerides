const mongoose = require('mongoose');

const settingsSetSchema = mongoose.Schema({
  providers: [{ name: String, isChecked: Boolean }],
  customerGrade: { isChecked: Boolean, value: Number },
  pickupDistance: { isChecked: Boolean, value: Number },
  ridePrice: { isChecked: Boolean, value: Number },
  rideDistance: { isChecked: Boolean, value: Number },
  rideMarkup: { isChecked: Boolean, value: Number },
});

const SettingsSet = mongoose.model('settingsSets', settingsSetSchema);

module.exports = SettingsSet;
