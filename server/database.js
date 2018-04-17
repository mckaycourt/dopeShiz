'use strict';
const MongoClient = require('mongodb').MongoClient;

module.exports = function(dbName) {
    const promise = MongoClient.connect('mongodb://localhost:27017/')
        .then(client => client.db(dbName));
    return async function dbExec(callback) {
        const db = await promise;
        const collection = db.collection('users');
        const data = await callback(collection);
        return data;
    }
}
