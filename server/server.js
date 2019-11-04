const axios = require('axios');
const express = require('express');
const githubData = require('./data');
const moment = require('moment');
const _ = require('lodash');

const app = express();
app.use(express.static('public'));

var myUsers = ["darrell3001", "MikeMurrayDev"];
var today = moment().format();
var lastSevenDays = moment().subtract(7, 'days').calendar();

let cache = {};

var myData = []; 

function calculatePoints (commitNumber) {
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

app.get('/data', function(req, res){
  
  myUsers.forEach(user => {
    var myKey = user + ' ' + lastSevenDays   
    if (!cache[myKey]) {
      axios.get(`https://api.github.com/users/${user}/events`)      
      .then(response => {
        response.data.map((data)=>{
          let commitCount = 0; 
          if(!!data.payload.commits) {
            commitCount = data.payload.commits.length;
          }
          console.log('commit count: ', commitCount);
        })
        //cache[myKey] = response;
        //console.log('Key thing: ', cache);
        // myData[user] = cache[myKey] 
      })
      .catch(error => console.error(error));              
    } else {
      // myData[user] = cache[myKey];
    }
  });
  

});

module.exports = app;
