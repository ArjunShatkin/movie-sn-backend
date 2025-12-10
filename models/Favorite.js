const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: String, // TMDB movie ID
    required: true
  },
  movieTitle: {
    type: String,
    required: true
  },
  moviePoster: {
    type: String
  },
  addedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Many-to-many: Many users can favorite many movies
favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);