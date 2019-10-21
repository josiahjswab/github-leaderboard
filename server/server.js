require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.static('public'));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_EMAIL = process.env.GITHUB_EMAIL;
const GITHUB_USER = process.env.GITHUB_USER;

const Github = require('octokat')({ token: GITHUB_TOKEN })

let cache = {}

app.get('/api', (req, res) => {
// add some logic to return the data for all users
});

module.exports = app;
