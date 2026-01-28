'use strict';

/**
 * =============================================================================
 * Configuration for 1033 Program Map
 * =============================================================================
 *
 * SECURITY NOTICE:
 * - Never commit actual API keys or secrets to version control
 * - Use .env file for local development (already in .gitignore)
 * - Use environment variables for production deployment
 * - See .env.example for required configuration values
 */

require('dotenv').config();

module.exports = {
  // Database
  db: process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/1033-program-map',

  // Session
  sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',

  // Email (optional - for password reset functionality)
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@1033map.org'
  }
};
