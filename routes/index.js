'use strict';

const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('../controllers/home');
const mapController = require('../controllers/map');
const userController = require('../controllers/user');
const contactController = require('../controllers/contact');

// Passport config
const passportConfig = require('../config/passport');

/**
 * Public routes
 */
router.get('/', homeController.index);
router.get('/map', mapController.index);
router.get('/contact', contactController.getContact);
router.post('/contact', contactController.postContact);

/**
 * Authentication routes
 */
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/logout', userController.logout);
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);
router.get('/forgot', userController.getForgot);
router.post('/forgot', userController.postForgot);
router.get('/reset/:token', userController.getReset);
router.post('/reset/:token', userController.postReset);

/**
 * Account routes (require authentication)
 */
router.get('/account', passportConfig.isAuthenticated, userController.getAccount);
router.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
router.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
router.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);

/**
 * API routes
 */
router.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
