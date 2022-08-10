require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const API_KEY = 'Jackie-loves-Candy';
const usersForAuth = [
  {
    userID: 1,
    email: 'li.linfei@foxmail.com',
    password: '123456',
  },
];

app.post('/signInWithPassword', (req, res) => {
  // do not provide the authentication service
  if (!req.query || req.key !== API_KEY) return res.sendStatus(401);

  // User info for sign-in
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  console.log(user);

  // Find out the usr if user exists throughout email
  const usr = usersForAuth.find(usr => usr.email === user.email.toLowerCase());

  if (!usr) return res.sendStatus(403); // user is not exist, back to client

  // User exists, but password is wrong
  if (usr.password !== user.password) return res.sendStatus(403);

  // The client user don't want access token
  if (!returnSecureToken) return res.sendStatus(403);

  // Successfully authenticated, send token
  const idToken = jwt.sign(
    { userID: usr.userID },
    process.env.ACCESS_TOKEN_SECRET
  );
  res.json({
    idToken,
    localId: usr.userID,
    expiresIn: '600s',
  });
});

app.listen(3000, () => {
  console.log('The auth server has started successfully on port 3000');
});