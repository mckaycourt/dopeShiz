'use strict';

module.exports = Items;

function Items(dbExec) {
    const items = {};

    items.create = async function(username, name, date, time, emailFrom, emailTo, subject, message) {
        return dbExec(async collection => {
            const result = await collection.insertOne({ username, name, date, time, emailFrom, emailTo, subject, message });
            return result.insertedCount > 0;
        });        
    };

    items.getItems = async function() {
        return dbExec(async collection => {
            const results = await collection.find({}).toArray();
            return results;
        });
    };

    return items;
}
