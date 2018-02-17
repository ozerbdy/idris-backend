const Promise = require('bluebird'),
    GoogleMaps = require('@google/maps');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if(!GOOGLE_MAPS_API_KEY) throw new Error('Google maps api key is not defined as environment variable!');

const GoogleMapsClient = GoogleMaps.createClient({
    key: GOOGLE_MAPS_API_KEY,
    Promise: Promise
});

module.exports.client = GoogleMapsClient;
console.log('Google Maps Client initalized successfully');