'use strict';

module.exports = Users;

function Users(dbExec) {
    const users = {};

    users.create = async function(username, password, name, email) {
        return dbExec(async collection => {
            const result = await collection.insertOne({ username, password, name, email });
            return result.insertedCount > 0;
        });        
    };
    
    users.authenticate = async function(username, password) {
        return dbExec(async collection => {
            const results = await collection.find({ username, password }).toArray();
            return results.length > 0;
        });
    };

    users.exists = async function(username) {
        return dbExec(async collection => {
            const results = await collection.find({ username }).toArray();
            return results.length > 0;
        });
    };

    users.getUser = async function(username) {
        return dbExec(async collection => {
            const results = await collection.findOne({ username });
            return results;
        });
    };

    return users;
}
