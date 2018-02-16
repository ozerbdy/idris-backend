const mongo = require('./mongo'),
    ObjectId = require('mongodb').ObjectId,
    is = require('is_js'),
    Constants = require('../constants/constants');

const CollectionName = Constants.CollectionNames.users;

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