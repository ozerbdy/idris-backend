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

module.exports.getAssigned = (userId) => {
    const query = {
        userId: userId,
        state: Constants.TransportationState.assigned
    };

    return mongo.client.collection(CollectionName)
        .findOne(query);
};

module.exports.updatePackageStatuses = (userId, newPackageStatuses) => {
    const query = {
        userId: userId,
        state: Constants.TransportationState.assigned
    };

    const update = {
        $set: {
            packages: newPackageStatuses
        }
    };

    return mongo.client.collection(CollectionName)
        .updateOne(query, update);
};

module.exports.finish = (userId, newPackageStatuses) => {
    const query = {
        userId: userId,
        state: Constants.TransportationState.assigned
    };

    const update = {
        $set: {
            state: Constants.TransportationState.finished,
            packages: newPackageStatuses
        }
    };

    return mongo.client.collection(CollectionName)
        .findOneAndUpdate(query, update);
};