'use strict';

const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const secrets = require('../config/secrets');

/**
 * GET /contact
 */
exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 */
exports.postContact = [
  body('name').notEmpty().withMessage('Name cannot be blank'),
  body('email').isEmail().withMessage('Email is not valid'),
  body('message').notEmpty().withMessage('Message cannot be blank'),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect('/contact');
    }

    // Check if email is configured
    if (!secrets.email || !secrets.email.host || !secrets.email.user) {
      req.flash('info', { msg: 'Thank you for your message! (Email service not configured)' });
      return res.redirect('/contact');
    }

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
        to: secrets.email.from,
        from: req.body.email,
        replyTo: req.body.email,
        subject: `Contact Form: ${req.body.name}`,
        text: `From: ${req.body.name} <${req.body.email}>\n\n${req.body.message}`
      });

      req.flash('success', { msg: 'Email has been sent successfully!' });
      res.redirect('/contact');
    } catch (err) {
      console.error('Contact form email error:', err);
      req.flash('errors', [{ msg: 'Failed to send email. Please try again later.' }]);
      res.redirect('/contact');
    }
  }
];
