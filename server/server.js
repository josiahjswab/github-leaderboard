const express = require('express');
const githubData = require('./data');
const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
// , 'Albertove951', 'Puffshere'
let myUsers = [];
let yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
let cache = [];
let queue = [];
let sevenDaysArray = [];

for(let i = 1; i < 8; i++) {
  sevenDaysArray.push(moment().subtract(i, 'day').format('YYYY-MM-DD'))
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
        
function addUsersNeedingUpdateToTheQueue(cache, myUsers, processQueue) {
  for(var j = 0; j < myUsers.length; j++) {
    if(cache.length >= 1) {
      let count = 0;
      for(var i = 0; i < cache.length; i++) {
        let user = myUsers[j] + yesterday;
        if (cache[i].id === user) {
          console.log(`--- ${cache[i].id} EXISTS IN CACHE`);
          count++
        } 
      }
      if (count === 0) {
        queue.push(myUsers[j]);
      }
    } else {
      queue.push(myUsers[j]);
      console.log(`--- CACHE WAS EMPTY PUSHING ${myUsers[j]} TO QUEUE`);
    }
  }
  if(queue.length >= 1) {
    processQueue(queue);
  }
}

function processQueue(qArray) {
  qArray.forEach((username) => {
    axios.get(`https://api.github.com/users/${username}/events`, {headers: {
      'Authorization' : `token ${process.env.GITHUB_OAUTH}`
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
      console.log(res.data[0].actor.avatar_url);
      let profile = {
        id: username + yesterday,
        username: username,
        points: calculatePoints(perDay),
        avatar: res.data[0].actor.avatar_url
      };
      cache.push(profile);
      console.log(cache);
    })
    .then(() => queue = [])
    .catch(error => console.error(error));
  });
}

app.get('/getUserScores', function(req, res) {
  if(myUsers.length === 0 ) {
    res.status(200).json([{
      username: 'Add User', 
      points: '0',
      avatar: 'https://avatars3.githubusercontent.com/u/54999121?v=4'
    }]);
  } else {
    addUsersNeedingUpdateToTheQueue(cache, myUsers, processQueue)
    setTimeout(function(){ res.status(200).json(cache); }, 3000);
  }
});

app.post('/postUser', function(req, res) {
  myUsers.push(req.body.username);
  req.url = '/getUserScores'
  return res.json(req.body);
});

app.delete('/deleteUsers/:userName', function(req, res) {
  if(cache.length >= 1) {
    for(var i = 0; i < cache.length; i++) {
      if(cache[i].username === req.params.userName) {
        cache.splice(i, 1)
      }
      if(myUsers[i] === req.params.userName) {
        myUsers.splice(i, 1);
        console.log(req.params.userName + ' deleted from myuser array:' + myUsers)
      }
    }
  } else {
    console.log('--- NOTHING TO DELETE');
  }
  res.json(req.params.userName);
})

module.exports = app;
