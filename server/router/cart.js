'use strict';
const db = require('../cartDatabase')('inventory');
const passport = require('passport');
const Cart = require('../controller/Cart')(db);
const Router = require('express').Router;

const router = new Router();
module.exports = router;

router.post('/newItem', async (req, res) => {
    const body = req.body;
    console.log(body);
    if (!body || !body.itemName || !body.itemInfo) {
        res.status(400).send('Invalid body');
    } else {
        const check = await Cart.checkItems(req.user.username, body.itemName, body.itemInfo, body.quantity);
        if(check.length > 0){
            console.log("update");
            const created = await Cart.update(req.user.username, body.itemName, body.itemInfo, body.quantity);
            if (created) {
                res.status(200).send('Item created');
            } else {
                res.status(500).send("I don't know what happened but it didn't create the item");
            }
        } else {
            const created = await Cart.create(req.user.username, body.itemName, body.itemInfo, 1);
            if (created) {
                res.status(200).send('Item created');
            } else {
                res.status(500).send("I don't know what happened but it didn't create the item");
            }
        }

    }
});

router.get('/items', async (req, res) => {
    const body = req.body;


        if(req.user) {
            const found = await Cart.getItems(req.user.username);

            if (found) {
                res.status(200).send(found);
            } else {
                res.status(500).send("Where are the items");
            }
        }
});

router.post('/removeItem', async (req, res) => {
    const body = req.body;
    if (!body || !body.itemName || !body.itemInfo) {
        res.status(400).send('Invalid body');
        console.log("fail");
    } else {
        const created = await Cart.remove(body.itemName, body.itemInfo);
        if (created) {
            res.status(200).send('Item deleted');
        } else {
            res.status(500).send("I don't know what happened but it didn't delete the item");
        }
    }

});
// router.post('/', async (req, res) => {
//     const body = req.body;
//     if (!body || !body.username || !body.password) {
//         res.status(400).send('Invalid body');
//     } else {
//         const created = await Users.create(body.username, body.password);
//         if (created) {
//             res.status(200).send('User created');
//         } else {
//             res.status(500).send("I don't know what happened but it didn't create the user");
//         }
//     }
// });