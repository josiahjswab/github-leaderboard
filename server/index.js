<<<<<<< HEAD
const express = require('express')
const app = express()
const port = 3000
var path = require('path');

app.get('/style.css', function(req, res) {
  res.sendFile('/Users/mike/projects/sdcs-git-leaderboard/public/style.css');
});
app.get('/', (req, res) => res.sendFile('/Users/mike/projects/sdcs-git-leaderboard/public/index.html'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
=======
const app = require('./server');

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));
>>>>>>> wip - Create github API routes
