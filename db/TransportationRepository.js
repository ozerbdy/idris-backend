const mongo = require('./mongo'),
    ObjectId = require('mongodb').ObjectId,
    is = require('is_js'),
    Constants = require('../constants/constants');

const CollectionName = Constants.CollectionName.transportations;

module.exports.add = function(userId, packageObjects){
    const query = {
        userId: userId,
        applicationDate: new Date(),
        packages: packageObjects,
        state: Constants.TransportationState.assigned
    };

    return mongo.client.collection(CollectionName)
        .insertOne(query);
};
