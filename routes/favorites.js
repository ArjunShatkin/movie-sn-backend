const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// Get user's favorites
router.get('/user/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId })
      .sort({ addedDate: -1 });

    res.json({
      success: true,
      favorites: favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get favorites' 
    });
  }
});

// Add to favorites
router.post('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Must be logged in to add favorites' 
      });
    }

    const { movieId, movieTitle, moviePoster } = req.body;

    const favorite = new Favorite({
      userId: req.session.userId,
      movieId,
      movieTitle,
      moviePoster
    });

    await favorite.save();

    res.status(201).json({
      success: true,
      favorite: favorite
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add favorite' 
    });
  }
});

// Remove from favorites
router.delete('/:id', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Must be logged in' 
      });
    }

    await Favorite.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Favorite removed'
    });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete favorite' 
    });
  }
});

module.exports = router;