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
const MongoClient = require('mongodb').MongoClient;
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

var j = schedule.scheduleJob('5 * * * * *', function(){

    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("inventory");
        var datetime = new Date();
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day  = datetime.getDate();
        day = (day < 10 ? "0" : "") + day;
        var currentDate = year + "-" + month + "-" + day;
        var timeTest = "03:00";
        // console.log(timeTest.split(':')[0]);

        dbo.collection("items").find({date: currentDate}).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result);
            for(var i = 0; i < result.length; i++){
                var time = result[i].time;
                // console.log(time.splice(':'));
                // console.log('first');
                const mailOptions = {
                    from: "mckay.court@gmail.com",
                    to: result[i].emailTo,
                    subject: result[i].subject,
                    text: result[i].message
                };
                // console.log(mailOptions);
                var test = schedule.scheduleJob({hour: time.split(':')[0], minute: time.split(':')[1]}, function(){
                    console.log('it worked');
                    console.log(mailOptions);
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
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
        console.log(req.originalUrl);
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