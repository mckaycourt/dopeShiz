'use strict';
const db = require('../itemDatabase')('inventory');
const passport = require('passport');
const Items = require('../controller/Items')(db);
const Router = require('express').Router;

const router = new Router();
module.exports = router;

router.post('/newItem', async (req, res) => {
    const body = req.body;
    if (!body || !body.name || !body.emailTo || !body.subject || !body.message /*|| !req.user*/) {
        res.status(400).send("Not enough info");
    } else {
        const created = await Items.create(req.user.username, body.name, body.date, body.time, body.emailTo, body.subject, body.message, 0);
        if (created) {
            res.status(200).send('Item created');
        } else {
            res.status(500).send("I don't know what happened but it didn't create the item");
        }
    }
});

router.get('/items', async (req, res) => {
    const body = req.body;
    if(req.user) {
        const found = await Items.getItems(req.user.username);

        if (found) {
            res.status(200).send(found);
        } else {
            res.status(500).send("Where are the items");
        }
    }
});

router.post('/removeItem', async (req, res) => {
    const body = req.body;
    if (!body || !body._id) {
        res.status(400).send('Invalid body');
        console.log("fail");
    } else {

        const created = await Items.remove(body._id);
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