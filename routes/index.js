var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/chat';
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  // res.render('index', { title: 'Jubailuboxi', user: req.user });
  res.redirect('/yleinen');
});

router.get('/kayttajat', function(req, res, next) {
    const results = []; 
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
      // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
      // SQL Query > Select Data
        const query = client.query('SELECT * FROM users;');
      // Stream results back one row at a time
        query.on('row', (row) => {
            results.push(row);
        });
      // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            console.log("Haettiin " + results);
            return res.json(results);
        });
    });
});

router.get('/yleinen', isLoggedIn, (req,res) => {
    res.render('index', { title: 'Jubailuboxi', user: req.user.name.givenName, chatroom: 'yleinen' });
});

router.get('/politiikka', isLoggedIn, (req,res) => {
    res.render('index', { title: 'Jubailuboxi', user: req.user, chatroom: 'politiikka' });
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) { 
        return next(); 
    }
    res.redirect('/login');
}



module.exports = router;
