var express = require('express');
var fs = require('fs');
var Promise = require('bluebird');
var readFile = Promise.promisify(fs.readFile);

var app = express();

// console.log(__dirname + '/app/public')
app.use(express.static(__dirname + '/public'));

app.get(function(req, res) {
  console.log(req.method)

});

module.exports = app;