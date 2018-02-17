const mongo = require('./mongo'),
    ObjectId = require('mongodb').ObjectId,
    is = require('is_js'),
    Constants = require('../constants/constants');

const CollectionName = Constants.CollectionName.packages;

module.exports.get = (query) => {
    query = query || {};
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

module.exports.getPortablesByUnits = (maxWeight, maxNumOfPieces) => {
    const query = {
        state: Constants.PackageState.available,
        'capacity.weight' : {$lte: maxWeight},
        'capacity.pieces' : {$lte: maxNumOfPieces},
    };

    return this.get(query);
};

module.exports.updateStates = (ids, toState) => {
    const query = {
        _id: {$in: ids}
    };

    const update = {
        $set: {
            state: toState
        }
    };

    return mongo.client.collection(CollectionName)
        .updateMany(query, update);
};

module.exports.updateState = (id, toState) => {
    return this.updateStates([id], toState);
};
