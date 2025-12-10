const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Get all reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate('userId', 'username role profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get reviews' 
    });
  }
});

// Get all reviews by a user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews: reviews
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get user reviews' 
    });
  }
});

// Create a review
router.post('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Must be logged in to create a review' 
      });
    }

    const { movieId, movieTitle, moviePoster, rating, title, content, spoilers } = req.body;

    const review = new Review({
      userId: req.session.userId,
      movieId,
      movieTitle,
      moviePoster,
      rating,
      title,
      content,
      spoilers: spoilers || false
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'username role profilePicture');

    res.status(201).json({
      success: true,
      review: populatedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create review' 
    });
  }
});

module.exports = router;