var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Jubailuboxi' });
});

module.exports = router;
