const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['reviewer', 'casual'],
    default: 'casual',
    required: true
  },
  // Reviewer-specific fields
  bio: {
    type: String,
    default: ''
  },
  expertise: {
    type: [String], // e.g., ['Action', 'Sci-Fi', 'Horror']
    default: []
  },
  // Casual user fields
  favoriteGenre: {
    type: String,
    default: ''
  },
  // Common fields
  profilePicture: {
    type: String,
    default: ''
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  // Privacy settings
  emailPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);