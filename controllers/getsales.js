var secrets = require('../config/secrets');
var request = require('request');
var fs = require('fs');
var parser = require('JSONStream').parse('features.*.attributes')
var options = { db: secrets.db,  collection: 'id_county_item' };
var streamToMongo = require('stream-to-mongo')(options);
fs.createReadStream(__dirname + '/id_county_item.json').pipe(parser).pipe(streamToMongo);
