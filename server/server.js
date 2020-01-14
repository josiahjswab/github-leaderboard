const express = require('express');
const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
let myUsers = ['Albertove951', 'Puffshere', 'josiahjswab', 'Darrell3001'];
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
        
async function checkUserDataDate(cache, myUsers) {
  if(cache.length <= 0) {
    myUsers.forEach((user) => queue.push(user));
    console.log(`CACHE EMPTY: ${myUsers} ADDED TO QUEUE`);
  } else {
    for(var j = 0; j < myUsers.length; j++) {
      let count = 0;
      for(var i = 0; i < cache.length; i++) {
        let user = myUsers[j] + yesterday;
        if (cache[i].id === user) {
          count++
        }
      }        
      if (count === 0) queue.push(myUsers[j]);
    }
  }
  if(queue.length >= 1) {
    return true
    
  } else {
    return false
  }
}

function processQueue(qArray) {
  return new Promise((resolve, reject) => {
    let count = 0;
    qArray.forEach((username, index, array) => {
      axios.get(`https://api.github.com/users/${username}/events`, {headers: {
        'Authorization' : `token ${process.env.GITHUB_TOKEN}`
      }})
      .then(res => cacheData(res, username))
      .then(() => count === array.length - 1 ? resolve(cache) : count++ )
      .then(() => queue = [])
      .catch(error => console.error(error));

    });
    
  });
}

function cacheData(res, username) {
  return new Promise((resolve, reject) => {
    let perDay = [0,0,0,0,0,0,0];
    res.data.map((gitData) => {
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
    let profile = {
      id: username + yesterday,
      username: username,
      points: calculatePoints(perDay),
      avatar: res.data[0].actor.avatar_url
    };
    cache.push(profile);
    resolve(cache);
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
    checkUserDataDate(cache, myUsers)
      .then((result) => result ? processQueue(queue) : cache)
      .then((data) => res.status(200).json(data) )
      .catch((err) => console.log(err));
  }
});

app.post('/postUser', function(req, res) {
  //TODO: 1) do not allow duplicates into the myUsers array 2) update page after post request is succesful.
  myUsers.push(req.body.username);
  req.url = '/getUserScores'
  return res.json(req.body);
});

app.delete('/deleteUsers/:userName', function(req, res) {
  let didDelete = cache.length;
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
  }
  if(didDelete === cache.length) {
    console.log('hit')
    res.status(400).send('This user was not in cache. Check if your spelling is correct.');
  }
  res.status(200).json(req.params.userName);
})

module.exports = app;
