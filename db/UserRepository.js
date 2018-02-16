const mongo = require('./mongo'),
    Constants = require('../constants/constants');

const CollectionName = Constants.CollectionNames.users;

module.exports.get = function(username, password){
    const query = {
        username: username,
        password: password
    };

    return mongo.client.collection(CollectionName)
        .findOne(query);
};