require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const { API_KEY, usersInMemory, USER_NUMS } = require('./local-data');
const { initialServer, registerUser } = require('./controller');

const app = express();

// To solve the CORS error
app.use(
  cors({
    origin: 'http://127.0.0.1:5173',
  })
);
app.use(express.json());

initialServer(); // Fetching all the data from mongoDB into local-data

app.post('/signInWithPassword', (req, res) => {
  // Checking api key!
  if (!req.query || req.query.key !== API_KEY) return res.sendStatus(401);

  // User info for sign-in
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  // Find out the usr if user exists throughout email
  const usr = usersInMemory.find(usr => usr.email === user.email.toLowerCase());

  if (!usr) return res.sendStatus(403); // user is not exist, back to client
  // User exists, but password is wrong
  if (usr.password !== user.password) return res.sendStatus(403);
  // The client user don't want access token
  if (!req.body.returnSecureToken) return res.sendStatus(403);
  // Successfully authenticated, send token
  const idToken = jwt.sign(
    { userID: usr.userID },
    process.env.ACCESS_TOKEN_SECRET
  );

  res.json({
    idToken,
    localId: usr.userID,
    firstName: usr.firstName,
    lastName: usr.lastName,
    expiresIn: '600s',
  });
});

app.post('/signUp', (req, res) => {
  // Checking api key!
  if (!req.query || req.query.key !== API_KEY) return res.sendStatus(401);

  // User info for sign-up
  const user = {
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    firstName: req.body.username.split(' ')[0],
    lastName: req.body.username.split(' ')[1],
  };

  // The client user don't want access token
  if (!req.body.returnSecureToken) return res.sendStatus(403);

  // Register as a new user
  const usr = {
    ...user,
    userID: `c${++USER_NUMS}`,
  };

  // Push it into memory and mongoDB
  registerUser(usr);

  // Successfully authenticated, send token
  const idToken = jwt.sign(
    { userID: usr.userID },
    process.env.ACCESS_TOKEN_SECRET
  );

  res.json({
    idToken,
    localId: usr.userID,
    expiresIn: '600s',
    firstName: req.body.username.split(' ')[0],
    lastName: req.body.username.split(' ')[1],
  });
});

app.listen(3000, () => {
  console.log('The auth server has started successfully on port 3000');
});
