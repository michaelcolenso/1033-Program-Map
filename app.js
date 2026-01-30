/**
 * =============================================================================
 * 1033 Program Map - Main Application
 * =============================================================================
 *
 * Interactive visualization of military equipment transfers to law enforcement
 * agencies through the US Department of Defense 1033 Program.
 */

'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { csrf } = require('lusca');
const rateLimit = require('express-rate-limit');
const connectAssets = require('connect-assets');

// Load environment variables
require('dotenv').config();

// Configuration
const secrets = require('./config/secrets');

// Initialize Express
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const { Server } = require('socket.io');
const io = new Server(server);

/**
 * =============================================================================
 * Database Connection
 * =============================================================================
 */

mongoose.connect(secrets.db)
  .then(() => console.log('✓ MongoDB connected successfully'))
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Store db reference for Socket.io
let db;
mongoose.connection.once('open', () => {
  db = mongoose.connection.db;
});

/**
 * =============================================================================
 * Express Configuration
 * =============================================================================
 */

const ONE_DAY = 24 * 60 * 60 * 1000;
const TWO_WEEKS = 14 * ONE_DAY;

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

// Compression & logging
app.use(compression());
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: secrets.sessionSecret,
  cookie: {
    maxAge: TWO_WEEKS,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  },
  store: MongoStore.create({
    mongoUrl: secrets.db,
    touchAfter: ONE_DAY / 1000
  })
}));

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// CSRF protection (skip for API routes)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  csrf()(req, res, next);
});

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Template locals
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Remember return URL
app.use((req, res, next) => {
  const skipPaths = /^(\/auth|\/login|\/logout|\/signup|\/favicon)/i;
  if (!skipPaths.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});

// Asset pipeline (LESS/JS compilation)
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')],
  helperContext: app.locals
}));

// Static files
app.use(express.static(path.join(__dirname, 'public'), { maxAge: ONE_DAY }));

/**
 * =============================================================================
 * Routes
 * =============================================================================
 */

const routes = require('./routes');
app.use('/', routes);

/**
 * =============================================================================
 * Error Handling
 * =============================================================================
 */

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you requested could not be found.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).render('error', {
    title: 'Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An error occurred'
      : err.message
  });
});

/**
 * =============================================================================
 * Socket.io - Real-time Communication
 * =============================================================================
 */

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('getid', async (areaName) => {
    if (!db) {
      socket.emit('error', { message: 'Database not ready' });
      return;
    }

    try {
      const collection = db.collection('id_county_item');
      const results = await collection.find({ Areaname: areaName }).toArray();
      console.log(`Found ${results.length} records for ${areaName}`);
      socket.emit('id', results);
    } catch (err) {
      console.error('Query error:', err);
      socket.emit('error', { message: 'Query failed' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

/**
 * =============================================================================
 * Start Server
 * =============================================================================
 */

server.listen(app.get('port'), () => {
  console.log(`
  ┌────────────────────────────────────────────┐
  │   1033 Program Map                         │
  │   Server running on port ${app.get('port')}              │
  │   Environment: ${process.env.NODE_ENV || 'development'}                  │
  └────────────────────────────────────────────┘
  `);
});

module.exports = app;
