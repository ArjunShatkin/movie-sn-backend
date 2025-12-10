const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, bio, expertise, favoriteGenre } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username, email, and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username or email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user based on role
    const userData = {
      username,
      email,
      password: hashedPassword,
      role: role || 'casual'
    };

    // Add role-specific fields
    if (role === 'reviewer') {
      userData.bio = bio || '';
      userData.expertise = expertise || [];
    } else {
      userData.favoriteGenre = favoriteGenre || '';
    }

    const user = new User(userData);
    await user.save();

    // Don't send password back
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      expertise: user.expertise,
      favoriteGenre: user.favoriteGenre,
      joinedDate: user.joinedDate
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to register user',
      details: error.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }

    // Store user in session
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.role = user.role;

    // Don't send password back
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      expertise: user.expertise,
      favoriteGenre: user.favoriteGenre,
      profilePicture: user.profilePicture,
      joinedDate: user.joinedDate
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to login',
      details: error.message 
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to logout' 
      });
    }
    res.clearCookie('connect.sid');
    res.json({ 
      success: true, 
      message: 'Logout successful' 
    });
  });
});

// Get current user (check if logged in)
router.get('/current', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ 
        success: true, 
        user: null 
      });
    }

    const user = await User.findById(req.session.userId).select('-password');

    if (!user) {
      return res.json({ 
        success: true, 
        user: null 
      });
    }

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Current user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get current user' 
    });
  }
});

module.exports = router;