const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'USD' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
