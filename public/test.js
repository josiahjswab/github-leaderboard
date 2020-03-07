const fetch = require('node-fetch');

// this works
fetch('https://api.github.com/users/darrell3001/events')
 .then(response => response.json())
 .then(data => {
   console.log(JSON.stringify(data)); // Prints result from `response.json()` in getRequest
 })
 .catch(error => console.error(error));
// This works                 