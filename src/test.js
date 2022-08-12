const { fetchAllUsers } = require('./mongodb');

async function test() {
  const users = await fetchAllUsers();
  console.log(users);
}

test();
