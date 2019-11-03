const fetch = require('node-fetch');
const express = require('express');
const githubData = require('./data');
const app = express();
app.use(express.static('public'));

var myUsers = ["darrell3001", "MikeMurrayDev"];

let cache = {
};

app.get('/data', function(req, res){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  var myData = []; 
  today = mm + '/' + dd + '/' + yyyy;
  
  myUsers.forEach(user => {
    var myKey = user + today;
    
    if (!cache[myKey]) {
      fetch(`https://api.github.com/users/${user}/events`)
      
      .then(response => 
        response.json())
      .then(data => {
        cache[myKey] = data;
        myData[user] = cache[myKey] 
      })
      .catch(error => console.error(error));              
      // do something
    } else {
      myData[user] = cache[myKey] 

    }

  });
  console.log('Key thing: ', cache);

});

module.exports = app;
