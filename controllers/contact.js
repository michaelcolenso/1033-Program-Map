var secrets = require('../config/secrets');
var nodemailer = require("nodemailer");

// Initialize transport lazily to avoid startup errors when email is not configured
var smtpTransport = null;

function getTransport() {
  if (!smtpTransport && secrets.sendgrid && secrets.sendgrid.user) {
    smtpTransport = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: secrets.sendgrid.user,
        pass: secrets.sendgrid.password
      }
    });
  }
  return smtpTransport;
}

/**
 * GET /contact
 * Contact form page.
 */

exports.getContact = function(req, res) {
  res.render('contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 * @param email
 * @param name
 * @param message
 */

exports.postContact = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  var transport = getTransport();
  if (!transport) {
    req.flash('errors', { msg: 'Email service not configured' });
    return res.redirect('/contact');
  }

  var from = req.body.email;
  var name = req.body.name;
  var body = req.body.message;
  var to = 'your@email.com';
  var subject = 'Contact Form | Hackathon Starter';

  var mailOptions = {
    to: to,
    from: from,
    subject: subject,
    text: body
  };

  transport.sendMail(mailOptions, function(err) {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contact');
  });
};
