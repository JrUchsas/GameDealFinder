const mongoose = require('mongoose');

const savedGameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: String, required: true },
  title: { type: String, required: true },
  thumb: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('SavedGame', savedGameSchema);
