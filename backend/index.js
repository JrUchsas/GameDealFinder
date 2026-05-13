const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const CHEAPSHARK_API = 'https://www.cheapshark.com/api/1.0';

// Get all stores
app.get('/api/stores', async (req, res) => {
  try {
    const response = await axios.get(`${CHEAPSHARK_API}/stores`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Search for games by title
app.get('/api/games/search', async (req, res) => {
  const { title } = req.query;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const response = await axios.get(`${CHEAPSHARK_API}/games?title=${encodeURIComponent(title)}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search games' });
  }
});

// Advanced filtering and sorting for deals
app.get('/api/deals', async (req, res) => {
  try {
    // Forward all query parameters from the client to CheapShark
    const response = await axios.get(`${CHEAPSHARK_API}/deals`, { params: req.query });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching deals:', error.message);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Feature 2: Get live giveaways (Freebies) from GamerPower
app.get('/api/freebies', async (req, res) => {
  try {
    const response = await axios.get('https://www.gamerpower.com/api/giveaways');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching freebies:', error.message);
    res.status(500).json({ error: 'Failed to fetch freebies' });
  }
});

// Features 5 & 6: Get system requirements from RAWG
app.get('/api/games/details/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const RAWG_API_KEY = process.env.RAWG_API_KEY; // Should be in .env
    
    // First, search for the game to get the ID/slug
    const searchRes = await axios.get(`https://api.rawg.io/api/games?search=${encodeURIComponent(title)}&key=${RAWG_API_KEY}`);
    const game = searchRes.data.results[0];
    
    if (!game) return res.status(404).json({ error: 'Game not found on RAWG' });
    
    // Get full details including requirements
    const detailRes = await axios.get(`https://api.rawg.io/api/games/${game.id}?key=${RAWG_API_KEY}`);
    res.json(detailRes.data);
  } catch (error) {
    console.error('Error fetching RAWG details:', error.message);
    res.status(500).json({ error: 'Failed to fetch system requirements' });
  }
});

// Get deals for a specific game
app.get('/api/games/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${CHEAPSHARK_API}/games?id=${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game deals' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
