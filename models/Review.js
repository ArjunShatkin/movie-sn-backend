const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  spoilers: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// One-to-many: One user has many reviews
reviewSchema.index({ userId: 1 });
reviewSchema.index({ movieId: 1 });

module.exports = mongoose.model('Review', reviewSchema);