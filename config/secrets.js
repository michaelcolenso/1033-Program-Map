/**
 * =============================================================================
 * Configuration File for 1033 Program Map
 * =============================================================================
 *
 * This file reads configuration from environment variables.
 *
 * SECURITY NOTICE:
 * - Never commit actual API keys or secrets to version control
 * - Use .env file for local development (already in .gitignore)
 * - Use environment variables for production deployment
 * - See .env.example for required configuration values
 *
 * =============================================================================
 */

// Load environment variables from .env file
require('dotenv').config();

module.exports = {

  db: process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/test',

  sessionSecret: process.env.SESSION_SECRET,

  mailgun: {
    user: process.env.MAILGUN_USER,
    password: process.env.MAILGUN_PASSWORD
  },

  mandrill: {
    user: process.env.MANDRILL_USER,
    password: process.env.MANDRILL_PASSWORD
  },

  sendgrid: {
    user: process.env.SENDGRID_USER,
    password: process.env.SENDGRID_PASSWORD
  },

  nyt: {
    key: process.env.NYT_KEY
  },

  lastfm: {
    api_key: process.env.LASTFM_KEY,
    secret: process.env.LASTFM_SECRET
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  instagram: {
    clientID: process.env.INSTAGRAM_ID,
    clientSecret: process.env.INSTAGRAM_SECRET,
    callbackURL: '/auth/instagram/callback',
    passReqToCallback: true
  },

  github: {
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitter: {
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

  google: {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },

  linkedin: {
    clientID: process.env.LINKEDIN_ID,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: '/auth/linkedin/callback',
    scope: ['r_fullprofile', 'r_emailaddress', 'r_network'],
    passReqToCallback: true
  },

  steam: {
    apiKey: process.env.STEAM_KEY
  },

  twilio: {
    sid: process.env.TWILIO_SID,
    token: process.env.TWILIO_TOKEN
  },

  clockwork: {
    apiKey: process.env.CLOCKWORK_KEY
  },

  stripe: {
    apiKey: process.env.STRIPE_KEY
  },

  tumblr: {
    consumerKey: process.env.TUMBLR_KEY,
    consumerSecret: process.env.TUMBLR_SECRET,
    callbackURL: '/auth/tumblr/callback'
  },

  foursquare: {
    clientId: process.env.FOURSQUARE_ID,
    clientSecret: process.env.FOURSQUARE_SECRET,
    redirectUrl: process.env.FOURSQUARE_REDIRECT_URL || 'http://localhost:3000/auth/foursquare/callback'
  },

  venmo: {
    clientId: process.env.VENMO_ID,
    clientSecret: process.env.VENMO_SECRET,
    redirectUrl: process.env.VENMO_REDIRECT_URL || 'http://localhost:3000/auth/venmo/callback'
  }
};
