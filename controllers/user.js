'use strict';

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const secrets = require('../config/secrets');

/**
 * GET /login
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 */
exports.postLogin = [
  body('email').isEmail().withMessage('Email is not valid'),
  body('password').notEmpty().withMessage('Password cannot be blank'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect('/login');
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('errors', [{ msg: info.message }]);
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: 'Success! You are logged in.' });
        res.redirect(req.session.returnTo || '/');
      });
    })(req, res, next);
  }
];

/**
 * GET /logout
 */
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

/**
 * GET /signup
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 */
exports.postSignup = [
  body('email').isEmail().withMessage('Email is not valid'),
  body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/signup');
      }

      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        req.flash('errors', [{ msg: 'Account with that email address already exists.' }]);
        return res.redirect('/signup');
      }

      const user = new User({
        email: req.body.email,
        password: req.body.password
      });

      await user.save();

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    } catch (err) {
      next(err);
    }
  }
];

/**
 * GET /account
 */
exports.getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/profile
 */
exports.postUpdateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.location = req.body.location || '';

    await user.save();

    req.flash('success', { msg: 'Profile information updated.' });
    res.redirect('/account');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /account/password
 */
exports.postUpdatePassword = [
  body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/account');
      }

      const user = await User.findById(req.user.id);
      user.password = req.body.password;
      await user.save();

      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    } catch (err) {
      next(err);
    }
  }
];

/**
 * POST /account/delete
 */
exports.postDeleteAccount = async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.user.id });

    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash('info', { msg: 'Your account has been deleted.' });
      res.redirect('/');
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /reset/:token
 */
exports.getReset = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('errors', [{ msg: 'Password reset token is invalid or has expired.' }]);
      return res.redirect('/forgot');
    }

    res.render('account/reset', {
      title: 'Password Reset'
    });
  } catch (err) {
    req.flash('errors', [{ msg: 'An error occurred.' }]);
    res.redirect('/forgot');
  }
};

/**
 * POST /reset/:token
 */
exports.postReset = [
  body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match');
    }
    return true;
  }),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('back');
      }

      const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        req.flash('errors', [{ msg: 'Password reset token is invalid or has expired.' }]);
        return res.redirect('back');
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      req.logIn(user, async (err) => {
        if (err) {
          return next(err);
        }

        // Send confirmation email if configured
        if (secrets.email && secrets.email.host && secrets.email.user) {
          try {
            const transporter = nodemailer.createTransport({
              host: secrets.email.host,
              port: secrets.email.port,
              auth: {
                user: secrets.email.user,
                pass: secrets.email.password
              }
            });

            await transporter.sendMail({
              to: user.email,
              from: secrets.email.from,
              subject: 'Your password has been changed',
              text: 'Hello,\n\nThis is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            });
          } catch (emailErr) {
            console.error('Failed to send password change confirmation email:', emailErr);
          }
        }

        req.flash('success', { msg: 'Success! Your password has been changed.' });
        res.redirect('/');
      });
    } catch (err) {
      next(err);
    }
  }
];

/**
 * GET /forgot
 */
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 */
exports.postForgot = [
  body('email').isEmail().withMessage('Please enter a valid email address'),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/forgot');
      }

      const token = crypto.randomBytes(16).toString('hex');

      const user = await User.findOne({ email: req.body.email.toLowerCase() });

      if (!user) {
        req.flash('errors', [{ msg: 'No account with that email address exists.' }]);
        return res.redirect('/forgot');
      }

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      await user.save();

      // Send reset email if configured
      if (secrets.email && secrets.email.host && secrets.email.user) {
        try {
          const transporter = nodemailer.createTransport({
            host: secrets.email.host,
            port: secrets.email.port,
            auth: {
              user: secrets.email.user,
              pass: secrets.email.password
            }
          });

          await transporter.sendMail({
            to: user.email,
            from: secrets.email.from,
            subject: 'Reset your password',
            text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://' + req.headers.host + '/reset/' + token + '\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n'
          });

          req.flash('info', { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        } catch (emailErr) {
          console.error('Failed to send password reset email:', emailErr);
          req.flash('errors', [{ msg: 'Failed to send reset email. Please try again later.' }]);
        }
      } else {
        // No email configured - show token in dev mode
        if (process.env.NODE_ENV !== 'production') {
          req.flash('info', { msg: 'Password reset token: ' + token });
        } else {
          req.flash('errors', [{ msg: 'Email service not configured.' }]);
        }
      }

      res.redirect('/forgot');
    } catch (err) {
      next(err);
    }
  }
];
