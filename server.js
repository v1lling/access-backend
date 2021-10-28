#!/usr/bin/env node
const express = require('express');
const path = require('path');
const MongoStore = require('connect-mongo').default;
const app = express();
var session = require('express-session');
const dotenv = require('dotenv').config();
var cookieParser = require('cookie-parser');
var accessRouter = require('./routes/access');
var bodyParser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
  Session Middleware 
*/
app.use(cookieParser());

function allowCrossDomain(req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  const allowedOrigins = ['http://localhost:8081', 'https://fluttify.herokuapp.com', 'http://localhost:8080'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader("Access-Control-Allow-Headers", [
    "X-Requested-With",
    "Origin",
    "Accept",
    "Content-Type",
    "Cookie",
    "Content-Length",
    "Accept-Language"
  ]);
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
      next();
  }
}
app.use(allowCrossDomain);

app.use(session({
    secret: 'CHANGEMELATERSPOTIFLY',
    /*
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECTION,
      rolling: true,
      resave: false,
      useUnifiedTopology: true
    }),
    */
    cookie: {
      secure: false, //change later?
      httpOnly: false, //change later?!
      //maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));

/*
    Routes
*/
app.use('/access', accessRouter);

/*
    Middleware to force HTTPS
*/
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`)
  } else {
    next();
  }
});

/* 
    Middleware for serving Vue App
*/
const staticFileMiddleware = express.static(path.join(__dirname + '/web'));
app.use(staticFileMiddleware);

/*
MongoDB
*/
db = {};
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.MONGODB_CONNECTION, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log("DB connected sucessfully");
    db = client;
    accessDb = db.db('access');
})

/*
  Start Listening
*/
var server = app.listen(process.env.PORT || 8081, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

process.on('unhandledRejection', (reason, p) => {
  //console.log('Unhandled Rejection with reason:', reason);
});
