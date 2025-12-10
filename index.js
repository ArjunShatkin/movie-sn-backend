const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://movie-sn-frontend.vercel.app', 'https://movie-sn-frontend-arjunshatkin.vercel.app']
    : 'http://localhost:5173',
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'movie-social-network-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Movie Social Network API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        current: 'GET /api/auth/current'
      },
      movies: {
        search: 'GET /api/movies/search?query=batman',
        details: 'GET /api/movies/:id'
      },
      reviews: {
        create: 'POST /api/reviews',
        getByMovie: 'GET /api/reviews/movie/:movieId',
        getByUser: 'GET /api/reviews/user/:userId'
      },
      favorites: {
        add: 'POST /api/favorites',
        getUserFavorites: 'GET /api/favorites/user/:userId',
        remove: 'DELETE /api/favorites/:id'
      },
      users: {
        profile: 'GET /api/users/:id',
        update: 'PUT /api/users/:id'
      },
      health: 'GET /health'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    session: req.session ? 'enabled' : 'disabled'
  });
});

// API Routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const reviewRoutes = require('./routes/reviews');
const favoriteRoutes = require('./routes/favorites');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});