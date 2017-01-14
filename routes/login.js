var express = require('express');
var passport = require('passport');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var FacebookStrategy  =     require('passport-facebook').Strategy;
var config = require('../configuration/config');
var app = require('../app');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/chat';

// // Passport session setup.
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });
//
// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });
//
//
// // Use the FacebookStrategy within Passport.
//
// passport.use(new FacebookStrategy({
//     clientID: config.facebook_api_key,
//     clientSecret:config.facebook_api_secret ,
//     callbackURL: config.callback_url
//   },
//   function(accessToken, refreshToken, profile, done) {
//       return done(null, profile);
// }));
//
// app.use(passport.initialize());
// app.use(passport.session());

router.get('/', (req, res) => {
    res.render('login', { title: 'Jubailuboxi' });
});


router.post('/', (req, res, next) => {
    var nick = req.body.nick;
    console.log("Haluttiin nimimerkki " + nick);
    pg.connect(connectionString, (err, client, done) => {
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        var query = client.query("INSERT INTO users(nick) SELECT $1 WHERE NOT EXISTS (SELECT id FROM users WHERE nick=$2) RETURNING id", [nick, nick]);
        query.on('end', () => {
            done();
            req.session.sessionFlash = {type: 'user', message: nick };
            return     res.redirect('/');

        });
    });
    
});

router.get('/auth/facebook', passport.authenticate('facebook'));


router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/');
// }




module.exports = router;
