require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get('/', ( req, res ) => {
  res.send('GET request received');
});

app.post('/', ( req, res ) => {
  console.log(req.body);
  res.send('POST request received');
});

app.post('/user', ( req, res ) => {
  const { username, password, favoriteClub, newsLetter = false } = req.body;

  if (!username) {
    return res.status(400).send('Username required');
  }

  if (!password) {
    return res.status(400).send('Password required');
  }

  if (!favoriteClub) {
    return res.status(400).send('favorite club required');
  }

  if (username.length < 6 || username.length > 20) {
    return res.status(400).send('Username must be between 6 and 20 characters');
  }

  if (password.length < 8 || password.length > 36) {
    return res.status(400).send('Password must be between 8 and 36 characters');
  }

  if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
    return res.status(400).send('Password must contain at least one digit');
  }
  
});

app.use(function errorHandler( error, req, res, next ) {
  let response;
  if(NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;