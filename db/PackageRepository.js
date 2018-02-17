const mongo = require('./mongo'),
    ObjectId = require('mongodb').ObjectId,
    is = require('is_js'),
    Constants = require('../constants/constants');

const CollectionName = Constants.CollectionName.packages;

module.exports.get = (query) => {
    return mongo.client.collection(CollectionName)
        .find(query).toArray();
};

module.exports.getAll = () => {
    const query = {};
    return this.get(query);
};

module.exports.getAllByState = (byState) => {
    const query = {
        state: byState
    };
    return this.get(query);
};
