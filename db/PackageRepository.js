const mongo = require('./mongo'),
    ObjectId = require('mongodb').ObjectId,
    is = require('is_js'),
    Constants = require('../constants/constants');

const CollectionName = Constants.CollectionNames.packages;

module.exports.get = function(){
    const query = {};
    return mongo.client.collection(CollectionName)
        .find(query).toArray();
};
