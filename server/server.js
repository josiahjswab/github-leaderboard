const express = require('express');
const githubData = require('./data');
const axios = require('axios');
var moment = require('moment');

const app = express();
app.use(express.static('public'));

var myUsers = ["darrell3001", "MikeMurrayDev", "michaelerobertsjr"];
var today = moment().format();
var seventhDayFromToday = moment().subtract(7, 'days').calendar();

let cache = {};
var queue = [];

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
  // return axios.get(`https://api.github.com/users/${username}/events`)
  return mockData()
    .then(response => {
      response.data.map(data => {
        let commitCount = 0;
        if(!!data.payload.commits) commitCount = data.payload.commits.length;
        calculatePoints(commitCount);
      })
    })
    .catch(error => console.error(error));
 }

function isDataMissing(cache, myUsers) {
  let yesterday = moment().subtract(1, 'day').format("MM-DD-YYYY");

  var results = myUsers.map((username)=> {
    if (!cache[username + yesterday]) {
      // TODO: before we push in the queue, make sure it doesn't exist already there.
      queue.push(username);
    }
    return `Checked user ${username} on ${yesterday} for commits.`
  });
  return results;
}

function processQueue(queue) {
  // TODO: Should process each user in the queue and make a request to GitHub to get history
}

function fetchDataFromCache(cache) {
  // TODO: Iterate over keys in cache and calculate points for each user
  /**
   * {
   *    merobertsjr01-01-2019: 22,
   *    royhobbs01-01-2019: 2
   * }
   *
   */

}

app.get('/data', function(req, res) {
  var response = [isDataMissing(cache, myUsers),queue];
  //processQueue(queue);
  //fetchDataFromCache(cache);
  res.json(response);
});

app.get('/getUserScores', function(req, res) {
  let frontEndMockData = [
    {
        "username": "firstUser",
        "points": 5012
    },
    {
        "username": "secondUser",
        "points": 9182
    },
    {
        "username": "thirdUser",
        "points": 1736
    }
]
  res.json(frontEndMockData);
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
