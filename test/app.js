'use strict';

const request = require('supertest');
const app = require('../app.js');

describe('Public Routes', function() {
  describe('GET /', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
  });

  describe('GET /map', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/map')
        .expect(200, done);
    });
  });

  describe('GET /contact', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/contact')
        .expect(200, done);
    });
  });
});

describe('Authentication Routes', function() {
  describe('GET /login', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/login')
        .expect(200, done);
    });
  });

  describe('GET /signup', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/signup')
        .expect(200, done);
    });
  });

  describe('GET /forgot', function() {
    it('should return 200 OK', function(done) {
      request(app)
        .get('/forgot')
        .expect(200, done);
    });
  });
});

describe('API Routes', function() {
  describe('GET /api/health', function() {
    it('should return 200 OK with status', function(done) {
      request(app)
        .get('/api/health')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          if (!res.body.status) throw new Error('Missing status field');
          if (res.body.status !== 'ok') throw new Error('Status should be ok');
        })
        .end(done);
    });
  });
});

describe('Error Handling', function() {
  describe('GET /nonexistent-page', function() {
    it('should return 404', function(done) {
      request(app)
        .get('/nonexistent-page-that-does-not-exist')
        .expect(404, done);
    });
  });
});