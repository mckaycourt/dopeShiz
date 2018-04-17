'use strict';

process.on("unhandledRejection", function(err){
    console.error(err.stack);
    process.exit(1);
});

const bodyParser    = require('body-parser');
const config        = require('../config');
const dbExec        = require('./database')('inventory');
const express       = require('express');
const path          = require('path');
const userRouter    = require('./router/users');
const itemRouter    = require('./router/item');
const cartRouter    = require('./router/cart');
const MongoClient   = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const Users         = require('./controller/Users')(dbExec);
const Items         = require('./controller/Items')(dbExec);
const Cart          = require('./controller/Cart')(dbExec);

var nodemailer      = require('nodemailer');
var cookieParser    = require('cookie-parser');
var LocalStrategy   = require('passport-local').Strategy;
var passport        = require('passport');
var session         = require('express-session');
var schedule   = require('node-schedule');

/**
 * Questions:
 *
 * 
 * 3. How to get initial page load data? Three options:
 *     - Server stores cookies and browser reads cookies
 *     - Create a REST endpoint for initial load
 *     - Generate a dynamic JavaScript file
 */

// create the express app
const app = express();

// tell passport to use a local strategy and tell it how to validate a username and password
passport.use(new LocalStrategy(function(username, password, done) {
    Users.authenticate(username, password)
        .then(async authenticated => {
            if (authenticated) {
                const user = await Users.getUser(username);
                done(null, user);
            } else {
                done(null, false);
            }
        })
        .catch(err => {
            done(err);  
        });
}));

// tell passport how to turn a user into serialized data that will be stored with the session
passport.serializeUser(function(user, done) {
    done(null, user);
});

// tell passport how to go from the serialized data back to the user
passport.deserializeUser(async function(id, done) {
    // console.log("id " + id);
    const user = await Users.getUser(id.username);
    done(null, user);
});

app.use(cookieParser());
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', 
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    userRouter);

app.use('/api/items',
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    itemRouter);

app.use('/api/cart',
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    cartRouter);

app.get('/api/init', (req, res) => {
    res.send({
        friends: [],
        user: req.user
    });
});

app.get('/', (req, res, next) => {
    console.log("test");
    if(!req.user) {
        console.log('redirect');
        res.redirect('/login.html');
    }else{
        next();
    }
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mckay.court@gmail.com',
        pass: 'Mlhlt2200!!'
    }
});

let sentEmails = [];
let j = schedule.scheduleJob('30 * * * * *', function(){

    const url = "mongodb://localhost:27017/";

    MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        let dbo = db.db("inventory");
        let datetime = new Date();
        let year = datetime.getFullYear();
        let month = datetime.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        let day  = datetime.getDate();
        day = (day < 10 ? "0" : "") + day;
        let currentDate = year + "-" + month + "-" + day;
        let hour = datetime.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        let minutes = datetime.getMinutes();
        if(minutes !== 59){
            minutes++
        }else{
            hour++;
            minutes = 0;
        }
        minutes = (minutes < 10 ? "0" : "") + minutes;
        let currentTimePlusOne = hour + ":" + minutes;
        console.log("current time plus one is: " + currentTimePlusOne);

        console.log(sentEmails.length);
        if(sentEmails.length > 0){
            for(let i = 0; i < sentEmails.length; i++){
                let email = await dbo.collection("items").updateOne({_id: ObjectId(sentEmails[i])}, {$set: {sent: 1}});
                if(email.result.n > 0){
                    console.log('success');
                }

            }
        }

        dbo.collection("items").find({date: currentDate, time: currentTimePlusOne}).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result);
            for(let i = 0; i < result.length; i++){
                let time = result[i].time;
                console.log(time);
                // console.log('first');
                const id = result[i]._id;
                const mailOptions = {
                    from: "mckay.court@gmail.com",
                    to: result[i].emailTo,
                    subject: result[i].subject,
                    text: result[i].message
                };
                let test = schedule.scheduleJob({hour: time.split(':')[0], minute: time.split(':')[1]}, function(){
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                            sentEmails.push(id);
                        }
                    });
                });


            }
            db.close();
        });
    });
});

// serve index.html and static files
app.use(express.static(config.build.dest));

// make HTML5 routes work
app.use((req, res, next) => {
    if (req.method === 'GET') {
        const indexPath = path.resolve(config.build.dest, 'index.html');
        res.sendFile(indexPath);

    } else {
        next();
    }
});

// start listening for requests
const listener = app.listen(config.server.port, function(err) {
    if (err) throw err;

    const port = listener.address().port;
    console.log('Server listening on port: ' + port);

    // in development mode the server is started as a child process and
    // this next line will tell the parent process that the server is ready
    if (process.send) process.send({ type: 'server-listening', port: port });
});