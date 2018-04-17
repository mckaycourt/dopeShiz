'use strict';
var ObjectId = require('mongodb').ObjectID;
module.exports = Items;

function Items(dbExec) {
    const items = {};

    items.create = async function(username, name, date, time, emailTo, subject, message, sent) {
        return dbExec(async collection => {
            const result = await collection.insertOne({ username, name, date, time, emailTo, subject, message, sent });
            return result.insertedCount > 0;
        });        
    };

    items.getItems = async function(username) {
        return dbExec(async collection => {
            const results = await collection.find({username}).toArray();
            return results;
        });
    };

    items.remove = async function(id) {
        return dbExec(async collection => {
            const result = await collection.remove({ _id: ObjectId(id) });
            return result.result.n > 0;
        });
    };

    return items;
}
