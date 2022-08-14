const { createUser, fetchAllUsers } = require('./mongodb');
const { usersInMemory, USER_NUMS } = require('./local-data');
const { encodeUser } = require('./crypt');

async function initialServer() {
  try {
    usersInMemory = await fetchAllUsers();
    USER_NUMS = usersInMemory.length;
    // console message
    console.log(`The Server has been initialized...`);
    console.log(usersInMemory, USER_NUMS);
  } catch (err) {
    console.log(err);
  }
}

async function registerUser(user) {
  encodeUser(user); // password encoded by bcrypt

  // add it into localdata and DB
  console.log(user);
  usersInMemory.push(user);
  createUser(user);
}

module.exports = {
  initialServer,
  registerUser,
};
