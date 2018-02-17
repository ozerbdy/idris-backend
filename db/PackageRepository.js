const mongo = require('./mongo'),
    ObjectId = require('mongodb').ObjectId,
    is = require('is_js'),
    TypeHelper = require('../helpers/typeHelpers'),
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

module.exports.getByIds = (ids) => {
    const query = {
        _id: {$in : ids}
    };
    return this.get(query);
};

module.exports.getById = (id) => {
    return this.getByIds([id]);
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
    const query = {
        _id: TypeHelper.objectIdfy(id)
    };

    const update = {
        $set : {
            state: toState
        }
    };

    return mongo.client.collection(CollectionName)
        .findOneAndUpdate(query, update, {returnOriginal: false});
};
