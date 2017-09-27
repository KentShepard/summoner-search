var express = require('express');
var fs = require('fs');
var Promise = require('bluebird');
var readFile = Promise.promisify(fs.readFile);
var api_key = require('./app/config/riot');
var request = require('request')

var app = express();

var searched = {};
app.use(express.static(__dirname + '/public'));

app.get('/summoner', function(req, res) {
  var summonerName = req.query.name;
  if (searched[summonerName]) {
    res.send(searched[summonerName])
  } else {
    var summonerUrl = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${api_key}`

    request(summonerUrl, function(error, response, body) {
      var parsedInfo = JSON.parse(body);
      if (parsedInfo.name) {
        searched[summonerName] = {};
        searched[summonerName].accountInfo = parsedInfo;
        var rankedUrl = `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${parsedInfo.id}?api_key=${api_key}`

        request(rankedUrl, function(error, response, body) {
          var parsedRanked = JSON.parse(body);
          if (parsedRanked.length) {
            parsedRanked.forEach((rankedQ) => {
              if (rankedQ.queueType === 'RANKED_SOLO_5x5') {
                searched[summonerName].soloQ = rankedQ;
              } else if (rankedQ.queueType === 'RANKED_FLEX_SR') {
                searched[summonerName].flexQ = rankedQ;
              }
            })
            res.send(searched[summonerName]);
          } else {
            res.send(searched[summonerName]);
          }
        });
      } else {
        res.status(400).send('Error finding summoner')
      }
    });
  }
});

app.get('/matches', function(req, res) {
  var summonerName = req.query.name;
  var matchesUrl = `https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${searched[summonerName].accountInfo.accountId}/recent?api_key=${api_key}`

  request(matchesUrl, function(error, response, body) {
    var parsedMatches = JSON.parse(body);
    var results = [];
    for (var i = 0; i < 1; i++) {
      results.push(parsedMatches.matches[i]);
    }
    res.send(results);
  });
});

app.get('/match', function(req, res) {
  var accountId = req.query.accountId;
  var gameId = req.query.gameId;
  var matchUrl = `https://na1.api.riotgames.com/lol/match/v3/matches/${gameId}?api_key=${api_key}`

  request(matchUrl, function(error, response, body) {
    res.send(body);
  });
});

module.exports = app;