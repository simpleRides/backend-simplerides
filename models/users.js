const mongoose = require('mongoose');

const providerSchema = mongoose.Schema({
  providername: String,
  providerToken: String,
  isConnected: Boolean,
});

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  username: String,
  phone: String,
  token: String,
  providers: [providerSchema],
  settingsSet: { type: mongoose.Schema.Types.ObjectId, ref: 'settingsSets' },
});

const User = mongoose.model('users', userSchema);

module.exports = User;
