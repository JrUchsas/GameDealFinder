const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SavedGame = require('../models/SavedGame');
const User = require('../models/User');
const axios = require('axios');

// Get user preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.preferences || { language: 'en', currency: 'USD' });
  } catch (error) {
    console.error('Fetch preferences error:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { language, currency } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update preferences object
    user.preferences = {
      language: language || user.preferences.language,
      currency: currency || user.preferences.currency
    };

    await user.save();
    res.json(user.preferences);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get all saved games for a user
router.get('/saved-games', auth, async (req, res) => {
  try {
    const games = await SavedGame.find({ userId: req.user.userId });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved games' });
  }
});

// Save a game
router.post('/saved-games', auth, async (req, res) => {
  try {
    const { gameId, title, thumb } = req.body;
    
    // Check if already saved by ID OR Title for this specific user
    const existing = await SavedGame.findOne({ 
      userId: req.user.userId, 
      $or: [
        { gameId },
        { title: { $regex: new RegExp(`^${title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') } }
      ]
    });

    if (existing) return res.status(400).json({ error: 'Game already saved' });

    const newSavedGame = new SavedGame({
      userId: req.user.userId,
      gameId: gameId || title, // Fallback to title if gameId is missing
      title,
      thumb
    });
    await newSavedGame.save();
    res.status(201).json(newSavedGame);
  } catch (error) {
    console.error('Save game error:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

// Remove a saved game
router.delete('/saved-games/:gameId', auth, async (req, res) => {
  try {
    const { gameId } = req.params;
    await SavedGame.findOneAndDelete({ userId: req.user.userId, gameId });
    res.json({ message: 'Game removed from saved list' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove saved game' });
  }
});

// Proxy for crack status
router.get('/crack-status/:title', async (req, res) => {
  try {
    const { title } = req.params;
    // Using CrackWatcher API which is active as of 2026
    const response = await axios.get(`https://crackwatcher.com/api/v1/games?search=${encodeURIComponent(title)}`);
    
    // The API returns { data: [...] }
    const games = response.data.data;
    
    // Find the best match (simple exact title match or first result)
    const exactMatch = games.find(g => g.title.toLowerCase() === title.toLowerCase());
    const result = exactMatch || games[0] || null;

    res.json(result);
  } catch (error) {
    console.error('Crack status fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch crack status' });
  }
});

module.exports = router;
