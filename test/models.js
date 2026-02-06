'use strict';

const chai = require('chai');
const should = chai.should();
const User = require('../models/User');

describe('User Model', function() {
  it('should create a new user', async function() {
    const user = new User({
      email: 'test@gmail.com',
      password: 'password'
    });
    await user.save();
  });

  it('should not create a user with the unique email', async function() {
    const user = new User({
      email: 'test@gmail.com',
      password: 'password'
    });
    try {
      await user.save();
    } catch (err) {
      err.code.should.equal(11000);
    }
  });

  it('should find user by email', async function() {
    const user = await User.findOne({ email: 'test@gmail.com' });
    user.email.should.equal('test@gmail.com');
  });

  it('should delete a user', async function() {
    await User.deleteOne({ email: 'test@gmail.com' });
  });
});
