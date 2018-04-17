'use strict';
var cookieParser    = require('cookie-parser');

module.exports = Cart;

function Cart(dbExec) {
    const cart = {};

    cart.create = async function(username, itemName, itemInfo, quantity) {
        return dbExec(async collection => {
            console.log(itemName);
            const result = await collection.insertOne({ username, itemName, itemInfo, quantity });
            return result.insertedCount > 0;
        });        
    };

    cart.remove = async function(itemName, itemInfo) {
        return dbExec(async collection => {
            const result = await collection.remove({ itemName, itemInfo });
            return result.result.n > 0;
        });
    };

    cart.update = async function(username, itemName, itemInfo, quantity) {
        return dbExec(async collection => {
            console.log(quantity);
            var newQuantity = quantity++;
            var obj = {quantity: newQuantity};
            const result = await collection.updateOne(
                { username, itemName, itemInfo, quantity },
                { $set: {'quantity': newQuantity} }
                );
            console.log(result.modifiedCount);
            return result.modifiedCount > 0;
        });
    };

    cart.getItems = async function(username) {
        return dbExec(async collection => {
            const results = await collection.find({username}).toArray();
            console.log(results);
            return results;
        });
    };

    cart.checkItems = async function(username, itemName, itemInfo) {
        return dbExec(async collection => {
            const results = await collection.find({username, itemName, itemInfo}).toArray();
            console.log(results);
            return results;
        });
    };

    return cart;
}
