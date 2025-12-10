const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile (public view)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Hide email if not public
    const userResponse = user.toObject();
    if (!user.emailPublic && req.session.userId !== user._id.toString()) {
      delete userResponse.email;
    }

    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get user' 
    });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    if (!req.session.userId || req.session.userId !== req.params.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const updates = req.body;
    delete updates.password; // Don't allow password updates here
    delete updates.username; // Don't allow username changes

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update user' 
    });
  }
});

module.exports = router;