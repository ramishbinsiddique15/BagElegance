// models/tempUser-model.js

const mongoose = require('mongoose');
const tempUserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationToken: { type: String, required: true },
  createdAt: { type: Date, expires: '1d', default: Date.now } // Automatically remove unverified users after 1 day
});

module.exports = mongoose.model('TempUser', tempUserSchema);
