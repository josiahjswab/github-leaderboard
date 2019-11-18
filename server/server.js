const express = require('express');
const githubData = require('./data');
const axios = require('axios');
var moment = require('moment');

const app = express();
app.use(express.static('public'));

var myUsers = ["darrell3001", "MikeMurrayDev"];
var today = moment().format();
var seventhDayFromToday = moment().subtract(7, 'days').calendar();

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
});

function mockData() {
  return new Promise((resolve, reject) => {
    resolve({
      data: [
        {
          "id": "10723766875",
          "type": "PushEvent",
          "actor": {
            "id": 40833437,
            "login": "darrell3001",
            "display_login": "darrell3001",
            "gravatar_id": "",
            "url": "https://api.github.com/users/darrell3001",
            "avatar_url": "https://avatars.githubusercontent.com/u/40833437?"
          },
          "repo": {
            "id": 210208145,
            "name": "darrell3001/sdcs-codechallenges",
            "url": "https://api.github.com/repos/darrell3001/sdcs-codechallenges"
          },
          "payload": {
            "push_id": 4200409593,
            "size": 1,
            "distinct_size": 1,
            "ref": "refs/heads/master",
            "head": "9b308f743626aaf9e6a6e27618044da881e28257",
            "before": "6ac402edeb04ff5acb827737829d99c7567c3faf",
            "commits": [
              {
                "sha": "9b308f743626aaf9e6a6e27618044da881e28257",
                "author": {
                  "email": "darrell3001@gmail.com",
                  "name": "Darrell Sturdivant"
                },
                "message": "fix code error spotted by Albert",
                "distinct": true,
                "url": "https://api.github.com/repos/darrell3001/sdcs-codechallenges/commits/9b308f743626aaf9e6a6e27618044da881e28257"
              }
            ]
          },
          "public": true,
          "created_at": "2019-10-27T20:59:42Z"
        }
      ]
    });
  });
}

module.exports = app;
