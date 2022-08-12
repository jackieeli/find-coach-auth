const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/auth')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const userSchema = new mongoose.Schema({
  userID: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

async function createUser(signingUpUser) {
  const user = new User(signingUpUser);
  const result = await user.save();
  console.log(result);
}

async function fetchAllUsers() {
  let usrs = [];
  const users = await User.find();
  users.forEach(user => {
    const usr = {
      userID: user.userID,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    };
    usrs.push(usr);
  });

  return usrs;
}

module.exports = {
  createUser,
  fetchAllUsers,
};
