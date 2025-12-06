const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Search movies
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query: query,
        language: 'en-US',
        page: 1
      }
    });

    res.json({
      success: true,
      results: response.data.results,
      total: response.data.total_results,
      query: query
    });

  } catch (error) {
    console.error('TMDB Search Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to search movies',
      details: error.message 
    });
  }
});

// Get movie details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'en-US'
      }
    });

    res.json({
      success: true,
      movie: response.data
    });

  } catch (error) {
    console.error('TMDB Details Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get movie details',
      details: error.message 
    });
  }
});

module.exports = router;