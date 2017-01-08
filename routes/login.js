var express = require('express');
var passport = require('passport');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var FacebookStrategy  =     require('passport-facebook').Strategy;
var config = require('../configuration/config');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/chat';

router.post('/login', (req, res, next) => {
    var nick = req.body.nick;
    pg.connect(connectionString, (err, client, done) => {
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        client.query('SELECT * FROM users WHERE nick=' + nick, function(err, rows, fields) {
    
            if (err) throw err;
            if (rows.length === 0) {
                console.log("There is no such user, adding now");
                client.query("INSERT into users(nick) VALUES('" + nick + "')");
            } else {
                console.log("User already exists in database");
            }
        });
    });
    res.render('index', { title: 'Jubailuboxi', user: 'nick' });
    
});


module.exports = router;
