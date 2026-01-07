var secrets = require('../config/secrets');
var fs = require('fs');
var parser = require('JSONStream').parse('features.*.attributes');

// Note: This script imports data from a local JSON file into MongoDB
// Run this script manually when you need to refresh the 1033 Program data
console.log('Starting data import from id_county_item.json...');

// Using mongoose for the import since stream-to-mongo is outdated
var mongoose = require('mongoose');

mongoose.connect(secrets.db).then(function() {
  console.log('Connected to MongoDB');
  var collection = mongoose.connection.collection('id_county_item');
  var data = require('./id_county_item.json');

  if (data.features) {
    var documents = data.features.map(function(f) { return f.attributes; });
    collection.insertMany(documents).then(function(result) {
      console.log('Inserted', result.insertedCount, 'documents');
      mongoose.connection.close();
    }).catch(function(err) {
      console.error('Insert error:', err);
      mongoose.connection.close();
    });
  }
}).catch(function(err) {
  console.error('MongoDB connection error:', err);
});
