const mongo = require('mongodb');

function init(url, dbName, callback){
    const options = {
        autoReconnect: true
    };
    mongo.connect(url, options, (err, client) => {
        module.exports.client = client.db(dbName);
        return callback(err);
    });
}

module.exports.init = init;