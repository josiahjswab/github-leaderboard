const axios = require('axios');
const express = require('express');
const githubData = require('./data');
const moment = require('moment');
const _ = require('lodash');

const NUMBER_OF_DAYS = 7;

const app = express();
app.use(express.static('public'));

var myUsers = ["darrell3001", "MikeMurrayDev"];
var today = moment().format();
var lastSevenDays = moment().subtract(7, 'days').calendar();

let cache = {};

var myData = [];

function calculatePoints(commitNumber) {
  switch(commitNumber) {
    case 0:
      return 0;
    case 1:
      return 5;
    case 2:
      return 7;
    default:
      return commitNumber + 5
  }
}

function getUsersCommits(username) {
  return axios.get(`https://api.github.com/users/${username}/events`)
    .then(response => {
      response.data.map(data => {
        let commitCount = 0;
        if(!!data.payload.commits) commitCount = data.payload.commits.length;
        calculatePoints(commitCount);
      })
    })
    .catch(error => console.error(error));
}

function isDataMissing(cache, username, numberOfDaysToCheck) {
  for (let i = 0; i < numberOfDaysToCheck; i++) {
    var myKey = username + moment().subtract(i, 'day').format("MM-DD-YYYY");
    if (!cache[myKey]) {
      return true;
    }
  }
  return false;
}

app.get('/data', function(req, res){
  const results = myUsers.forEach(username => {
    if (isDataMissing(cache, username, NUMBER_OF_DAYS)) {
      // warm up the cache for this user
      return getUsersCommits(username)
        .then(points => { // we get back an array of objects with scores and dates
          // TODO: for each object push it into the cache
        })
        .catch(errorGettingUsers => console.log(errorGettingUsers));
    } else {
      // return the data from the cache return as a new promise
    }
  });

  Promise.all(results)
   .then(data => res.send(data))
   .catch(err => console.log(err));
});

module.exports = app;
