require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.static('dist'));
app.use(express.static('public'));

dotenv.config();

const authToken = `${process.env.GITHUB_TOKEN}`;
const gitHubEmail = `${process.env.GITHUB_EMAIL}`;
const gitHubUser = `${process.env.GITHUB_USER}`;

const github = require('octokat')({ token: authToken })





app.get('/api', (req, res) => {
  // axios.get(`http://www.mocky.io/v2/5d5cba7e320000a5e4628f33?apikey=${process.env.APIKEY}`)
  axios.get(`http://www.mocky.io/v2/5d5cba7e320000a5e4628f33?apikey=${process.env.APIKEY}`)
      .then((result) => {
          res.send(result.data);
      })
      .catch((error) => {
          console.error(error);
          res.send('An error occured.');
      })
});

module.exports = app;








//#region 
// return github.fromUrl(`https://api.github.com/users/${gitHubUser}/events`)
//   .fetch()
//   .then(events => {
//     let lastCommit

//     events.some(event => {
//       return event.type === 'PushEvent' && event.payload.commits.reverse().some(commit => {
//         if (commit.author.email === gitHubEmail) {
//           lastCommit = {
//             repo: event.repo.name,
//             sha: commit.sha,
//             time: new Date(event.createdAt),
//             message: commit.message,
//             url: commit.url
//           }

//           return true
//         }

//         return false
//       })
//     })

//     return lastCommit
//   })


//#endregion