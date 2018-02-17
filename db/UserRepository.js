const mongo = require('./mongo');
const ObjectId = require('mongodb').ObjectId;
const is = require('is_js');
const TypeHelpers = require('../helpers/typeHelpers');
const Constants = require('../constants/constants');

const CollectionName = Constants.CollectionName.users;

module.exports.getToken = function(username, password){
    const query = {
        username: username,
        password: password
    };

    return mongo.client.collection(CollectionName)
        .findOne(query);
};

module.exports.get = function(token){
    const query = {
        _id: ObjectId(token)
    };

    return mongo.client.collection(CollectionName)
        .findOne(query);
};

module.exports.updateCoordinates = function(userId, latitude, longitude){
    const query = {
        _id: is.string(userId) ? ObjectId(userId) : userId
    };

    const update = {
        $set: {
            coordinates : {
                latitude: latitude,
                longitude: longitude
            }
        }
    };

    return mongo.client.collection(CollectionName)
        .updateOne(query, update);
};

module.exports.updateInfo = function (userId, latitude, longitude, weightCapacity, piecesCapacity) {
    const query = {
        _id: is.string(userId) ? ObjectId(userId) : userId
    };

    const update = {
        $set: {
            coordinates : {
                latitude: latitude,
                longitude: longitude
            },
            capacity: {
                weight: weightCapacity,
                pieces: piecesCapacity
            }
        }
    };

    return mongo.client.collection(CollectionName)
        .updateOne(query, update);
};