const express = require('express');
const githubData = require('./data');
const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

let myUsers = ["josiahjswab"];
let yesterday = moment().subtract(1, 'day').format("YYYY-MM-DD");
let cache = {};
let queue = [];
let sevenDaysArray = [];

for(let i = 1; i < 8; i++) {
  sevenDaysArray.push(moment().subtract(i, 'day').format("YYYY-MM-DD"))
};

function calculatePoints(perDay) {
  let totalPoints = 0;
  perDay.map((day) => {
    switch(day) {
    case 0:
      totalPoints += 0;
      break;
    case 1:
      totalPoints += 5;
      break;
    case 2:
      totalPoints += 7;
      break;
    default:
      totalPoints += (day + 5)
      break;
    };
  })
  return totalPoints;
}
        
function addUsersNeedingUpdateToTheQueue(cache, myUsers) {
  return myUsers.map((username)=> {
    if (!cache[username + yesterday]) {
      queue.push(username);
    } else {
      console.log('you hit cache instead of que')
    };
  });
}

function processQueue(qArray) {
  // TODO: Should process each user in the queue and make a request to GitHub to get history
  qArray.forEach((username) => {
    axios.get(`https://api.github.com/users/${username}/events`, {headers: {
      "Authorization" : `token ${process.env.GITHUB_OAUTH}`
    }})
    .then(res => {
      let perDay = [0,0,0,0,0,0,0];
      res.data.map(gitData => {
        let commitCount = 0;
        let commitDate = gitData.created_at.substring(0, 10);
        switch(commitDate) {
          case sevenDaysArray[0]:
            perDay[0]++
            break;
          case sevenDaysArray[1]:
            perDay[1]++
            break;
          case sevenDaysArray[2]:
            perDay[2]++
            break;
          case sevenDaysArray[3]:
            perDay[3]++
            break;
          case sevenDaysArray[4]:
            perDay[4]++
            break;
          case sevenDaysArray[5]:
            perDay[5]++
            break;
          case sevenDaysArray[6]:
            perDay[6]++
            break;
          default:
            null;
        }
      });
      cache[username + yesterday] = calculatePoints(perDay);
    })
    .then(() => console.log(cache))
    .then(() => console.log(queue))
    .then(() => queue = [])
    .then(() => console.log(queue))
    .catch(error => console.error(error));
  });

}

function fetchDataFromCache(cache) {
  // TODO: Iterate over keys in cache and calculate points for each user
  
}

app.get('/getUserScores', function(req, res) {
  addUsersNeedingUpdateToTheQueue(cache, myUsers,)
  if(queue.length <= 1) {
    processQueue(queue);
  }
  fetchDataFromCache(cache);
  res.status(200).json(cache);
});

app.post('/postUser', function(req, res) {
  myUsers.push(req.body.username);
  return res.json(req.body);
});

// app.get('/getUserScores', function(req, res) {
//   let frontEndMockData = [
//     {
//         "username": "firstUser",
//         "points": 5012
//     },
//     {
//         "username": "secondUser",
//         "points": 9182
//     },
//     {
//         "username": "thirdUser",
//         "points": 1736
//     }
// ]
//   res.json(frontEndMockData);
// });

app.delete('/deleteUsers/:userName', function(req, res) {
  delete cache[req.params.userName];
  res.json(req.params.userName);
})

module.exports = app;
